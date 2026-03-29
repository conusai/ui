import JSZip from "jszip";
import type { Browser } from "playwright";
import { chromium } from "playwright";
import { VIEWPORTS } from "./types";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

const SETTLE_MS = 1500;

export async function GET() {
  const baseUrl = process.env.EXPORT_BASE_URL || "http://localhost:3000";
  const targetPath = "/demo/todolist";

  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const zip = new JSZip();

    // Use a single context with the largest viewport, reuse the page
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1200 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto(`${baseUrl}${targetPath}`, {
      waitUntil: "networkidle",
    });

    // Wait for the loader to finish and frame to appear
    await page.waitForSelector('[data-screenshot="preview-frame"]', {
      state: "visible",
      timeout: 15_000,
    });
    await page.waitForTimeout(SETTLE_MS);

    for (const vp of VIEWPORTS) {
      // Resize viewport for each mode
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Click the preview mode button
      await page.click(`button[data-preview-mode="${vp.id}"]`);
      await page.waitForTimeout(SETTLE_MS);

      // Screenshot the preview frame element
      const frame = page.locator('[data-screenshot="preview-frame"]');
      const png = await frame.screenshot({ type: "png" });
      zip.file(`conusai-${vp.id}.png`, png);
    }

    await context.close();
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
    await browser.close();

    return new Response(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="conusai-screenshots.zip"',
      },
    });
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    const message =
      error instanceof Error ? error.message : "Screenshot generation failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
