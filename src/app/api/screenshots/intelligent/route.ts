import AdmZip from "adm-zip";
import type { NextRequest } from "next/server";
import type { Browser, Locator, Page } from "playwright";
import { chromium } from "playwright";

import { explorerModel } from "@/lib/gemini-client";
import type { GeminiExplorerResponse } from "@/tools/screenshot-generator";
import {
  EXPLORER_SYSTEM_PROMPT,
  type ProjectKey,
  screenshotProjects,
} from "@/tools/screenshot-generator";
import { VIEWPORTS } from "@/app/api/export/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const SETTLE_MS = 1200;
const MAX_STEPS = 25;
const MAX_PROMPT_LENGTH = 1000;

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

async function explorePreviewMode(
  page: Page,
  frame: Locator,
  projectKey: string,
  modeKey: string,
  zip: AdmZip,
  userPrompt: string
): Promise<number> {
  let step = 0;
  let staleSteps = 0;
  const visitedLabels = new Set<string>();
  const triedActions = new Set<string>();
  const actionHistory: string[] = [];

  // Capture initial state — frame only
  const initialPng = await frame.screenshot({ type: "png" });
  zip.addFile(
    `${projectKey}-${modeKey}-step0-initial.png`,
    Buffer.from(initialPng)
  );
  step++;

  while (step < MAX_STEPS) {
    // Take a screenshot of the frame for Gemini to analyse
    const screenshotBuffer = await frame.screenshot({ type: "png" });
    const base64Screenshot = Buffer.from(screenshotBuffer).toString("base64");

    const previousStates =
      visitedLabels.size > 0
        ? `Previously captured states: ${[...visitedLabels].join(", ")}`
        : "No states captured yet besides the initial view.";

    const triedSummary =
      actionHistory.length > 0
        ? `Actions already tried (DO NOT repeat these):\n${actionHistory.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}`
        : "";

    const goalSummary = userPrompt
      ? `User-defined exploration goal (highest priority): ${userPrompt}`
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
              text: `Current URL: ${page.url()}\nPreview mode: ${modeKey}\n${goalSummary}\n${previousStates}\n${triedSummary}\n\nWhat NEW action should I do next to discover a screen I haven't captured yet while honoring the user-defined exploration goal? If nothing new remains, set "done": true. Respond with ONLY valid JSON.`,
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
        `[AI Explorer] Gemini says done for ${modeKey} after ${step} steps`
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
        `[AI Explorer] [${modeKey}] Step ${step}: all actions are repeats (stale ${staleSteps}/${MAX_STALE_STEPS})`
      );
      if (staleSteps >= MAX_STALE_STEPS) {
        console.log(
          `[AI Explorer] [${modeKey}] Aborting — ${MAX_STALE_STEPS} consecutive stale steps`
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
        `[AI Explorer] [${modeKey}] Step ${step}: ${action.type} — ${action.description}`
      );
      await executeAction(page, action);
      await page.waitForTimeout(SETTLE_MS);
    }

    // Capture screenshot of the new state — frame only
    const label = sanitize(parsed.screenshotLabel || `step${step}`);

    if (!visitedLabels.has(label)) {
      visitedLabels.add(label);
      const statePng = await frame.screenshot({ type: "png" });
      const filename = `${projectKey}-${modeKey}-step${step}-${label}.png`;
      zip.addFile(filename, Buffer.from(statePng));
      console.log(`[AI Explorer] Saved: ${filename}`);
    } else {
      // Duplicate label — count as stale
      staleSteps++;
      console.warn(
        `[AI Explorer] [${modeKey}] Step ${step}: duplicate label "${label}" (stale ${staleSteps}/${MAX_STALE_STEPS})`
      );
      if (staleSteps >= MAX_STALE_STEPS) {
        console.log(
          `[AI Explorer] [${modeKey}] Aborting — ${MAX_STALE_STEPS} consecutive stale steps`
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
  const userPrompt =
    request.nextUrl.searchParams
      .get("prompt")
      ?.trim()
      .slice(0, MAX_PROMPT_LENGTH) ?? "";

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
      // Use the largest viewport so all preview modes fit comfortably
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1200 },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      await page.goto(`${baseUrl}${seedRoute}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait for the loader to finish and frame to appear
      await page.waitForSelector('[data-screenshot="preview-frame"]', {
        state: "visible",
        timeout: 15_000,
      });
      await page.waitForTimeout(SETTLE_MS);

      for (const vp of VIEWPORTS) {
        // Resize viewport and switch preview mode via button
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.click(`button[data-preview-mode="${vp.id}"]`);
        await page.waitForTimeout(SETTLE_MS);

        const frame = page.locator('[data-screenshot="preview-frame"]');

        const totalSteps = await explorePreviewMode(
          page,
          frame,
          projectKey,
          vp.id,
          zip,
          userPrompt
        );
        console.log(
          `[AI Explorer] ${vp.id} exploration complete: ${totalSteps} steps`
        );
      }

      await context.close();
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
