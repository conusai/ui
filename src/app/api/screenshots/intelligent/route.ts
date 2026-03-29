import AdmZip from "adm-zip";
import type { NextRequest } from "next/server";
import type { Browser, Page } from "playwright";
import { chromium } from "playwright";

import { EXPLORER_SYSTEM_PROMPT } from "@/components/conusai-ui/screenshot-generator/gemini-prompts";
import {
  type ProjectKey,
  screenshotProjects,
} from "@/components/conusai-ui/screenshot-generator/screenshot-config";
import type { GeminiExplorerResponse } from "@/components/conusai-ui/screenshot-generator/types";
import { explorerModel } from "@/lib/gemini-client";
import { viewports } from "@/lib/screenshot-utils";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const SETTLE_MS = 1200;
const MAX_STEPS = 25;

function sanitize(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function executeAction(
  page: Page,
  action: GeminiExplorerResponse["actions"][number]
) {
  try {
    switch (action.type) {
      case "click":
      case "tap-tab":
      case "open-sidebar":
      case "close-sidebar":
        if (action.selector) {
          await page.click(action.selector, { timeout: 5000 });
        }
        break;
      case "scroll":
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        break;
      case "scroll-up":
        await page.evaluate(() => window.scrollTo(0, 0));
        break;
      case "navigate":
        if (action.selector) {
          await page.goto(action.selector, {
            waitUntil: "networkidle",
            timeout: 10000,
          });
        }
        break;
      case "wait":
        await page.waitForTimeout(1000);
        break;
    }
  } catch {
    // Action failed (element not found, timeout, etc.) — continue exploring
    console.warn(
      `[AI Explorer] Action failed: ${action.type} ${action.selector || ""} — ${action.description}`
    );
  }
}

function actionSignature(
  action: GeminiExplorerResponse["actions"][number]
): string {
  return `${action.type}::${action.selector || ""}::${action.description}`;
}

const MAX_STALE_STEPS = 3;

async function exploreViewport(
  page: Page,
  projectKey: string,
  vpKey: string,
  zip: AdmZip
): Promise<number> {
  let step = 0;
  let staleSteps = 0;
  const visitedLabels = new Set<string>();
  const triedActions = new Set<string>();
  const actionHistory: string[] = [];

  // Capture initial state
  const initialPng = await page.screenshot({ fullPage: true, type: "png" });
  zip.addFile(
    `${projectKey}-${vpKey}-step0-initial.png`,
    Buffer.from(initialPng)
  );
  step++;

  while (step < MAX_STEPS) {
    // Take a screenshot of the current state for Gemini to analyse
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: "png",
    });
    const base64Screenshot = Buffer.from(screenshotBuffer).toString("base64");

    const previousStates =
      visitedLabels.size > 0
        ? `Previously captured states: ${[...visitedLabels].join(", ")}`
        : "No states captured yet besides the initial view.";

    const triedSummary =
      actionHistory.length > 0
        ? `Actions already tried (DO NOT repeat these):\n${actionHistory.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}`
        : "";

    const result = await explorerModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: EXPLORER_SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Screenshot,
              },
            },
            {
              text: `Current URL: ${page.url()}\nViewport: ${vpKey} (${page.viewportSize()?.width}x${page.viewportSize()?.height})\n${previousStates}\n${triedSummary}\n\nWhat NEW action should I do next to discover a screen I haven't captured yet? If nothing new remains, set "done": true. Respond with ONLY valid JSON.`,
            },
          ],
        },
      ],
    });

    const responseText = result.response.text().trim();
    // Strip markdown fences if present
    const jsonText = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: GeminiExplorerResponse;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.warn(
        `[AI Explorer] Failed to parse Gemini response, skipping step ${step}`,
        jsonText.slice(0, 200)
      );
      break;
    }

    if (parsed.done) {
      console.log(
        `[AI Explorer] Gemini says done for ${vpKey} after ${step} steps`
      );
      break;
    }

    // Check if ALL proposed actions have already been tried
    const proposedActions = parsed.actions || [];
    const allRepeats =
      proposedActions.length > 0 &&
      proposedActions.every((a) => triedActions.has(actionSignature(a)));

    if (allRepeats) {
      staleSteps++;
      console.warn(
        `[AI Explorer] [${vpKey}] Step ${step}: all actions are repeats (stale ${staleSteps}/${MAX_STALE_STEPS})`
      );
      if (staleSteps >= MAX_STALE_STEPS) {
        console.log(
          `[AI Explorer] [${vpKey}] Aborting — ${MAX_STALE_STEPS} consecutive stale steps`
        );
        break;
      }
      step++;
      continue;
    }

    staleSteps = 0;

    // Execute actions and record them
    for (const action of proposedActions) {
      const sig = actionSignature(action);
      triedActions.add(sig);
      actionHistory.push(
        `${action.type}${action.selector ? ` on "${action.selector}"` : ""} — ${action.description}`
      );
      console.log(
        `[AI Explorer] [${vpKey}] Step ${step}: ${action.type} — ${action.description}`
      );
      await executeAction(page, action);
      await page.waitForTimeout(SETTLE_MS);
    }

    // Capture screenshot of the new state
    const label = sanitize(parsed.screenshotLabel || `step${step}`);

    if (!visitedLabels.has(label)) {
      visitedLabels.add(label);
      const statePng = await page.screenshot({ fullPage: true, type: "png" });
      const filename = `${projectKey}-${vpKey}-step${step}-${label}.png`;
      zip.addFile(filename, Buffer.from(statePng));
      console.log(`[AI Explorer] Saved: ${filename}`);
    } else {
      // Duplicate label — count as stale
      staleSteps++;
      console.warn(
        `[AI Explorer] [${vpKey}] Step ${step}: duplicate label "${label}" (stale ${staleSteps}/${MAX_STALE_STEPS})`
      );
      if (staleSteps >= MAX_STALE_STEPS) {
        console.log(
          `[AI Explorer] [${vpKey}] Aborting — ${MAX_STALE_STEPS} consecutive stale steps`
        );
        break;
      }
    }

    step++;
  }

  return step;
}

export async function GET(request: NextRequest) {
  const projectKey = request.nextUrl.searchParams.get("project") as ProjectKey;
  if (!projectKey || !screenshotProjects[projectKey]) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid project parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const project = screenshotProjects[projectKey];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const zip = new AdmZip();

  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });

    for (const seedRoute of project.seedRoutes) {
      for (const [vpKey, viewport] of Object.entries(viewports)) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 2,
        });
        const page = await context.newPage();

        await page.goto(`${baseUrl}${seedRoute}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // Wait for the app to be ready
        await page.waitForTimeout(SETTLE_MS);

        const totalSteps = await exploreViewport(page, projectKey, vpKey, zip);
        console.log(
          `[AI Explorer] ${vpKey} exploration complete: ${totalSteps} steps`
        );

        await context.close();
      }
    }

    await browser.close();

    const zipBuffer = zip.toBuffer();
    return new Response(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectKey}-ai-screenshots.zip"`,
      },
    });
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    const message =
      error instanceof Error
        ? error.message
        : "AI screenshot exploration failed";
    console.error("[AI Explorer] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
