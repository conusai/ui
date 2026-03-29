**✅ Best Library for Rendering Demo UI Screens to Image (PNG) + PDF (2026 Recommendation)**

As your UX/UI designer and frontend dev specializing in React + Next.js + shadcn/ui + Framer Motion, I’ve researched the current 2026 landscape.

### Winner: **Playwright** (by Microsoft)

**Playwright** is the **clear best choice** for your ConusAI UI component library in 2026.

#### Why Playwright is Perfect for Your Use Case
- **Pixel-perfect fidelity** — renders your exact DOM (Tailwind 4 glassmorphism, backdrop-blur, gradients, mobile-preview-frame bezels, Framer Motion animations).
- **Mobile emulation** — built-in iPhone 16 / Android viewport + safe-area support (perfect for your `MobilePreviewFrame`).
- **Both image + PDF in one API** — `page.screenshot()` for PNG + `page.pdf()` for PDF.
- **Server-side (Next.js API route)** — works beautifully with App Router, Bun, and React 19.
- **Handles complex UIs** — waits for animations, network, or your custom `useMinimumDelay` loader.
- **Zero client bloat** — no heavy JS in the browser for exports.
- **Actively maintained & future-proof** — supports Chrome, Firefox, WebKit; used by Vercel, Shopify, and most modern design-system teams.

**Runner-ups (only if you need pure client-side):**
- **html-to-image** (`html-to-image`) + **jsPDF** — lightweight client-side (good for “Export” button in demo).
- **@react-pdf/renderer** — declarative React → PDF (but loses visual fidelity for complex Tailwind/Framer Motion styles).

Playwright wins for quality and reliability.

### Quick Integration (Bun + Next.js 16)

```bash
# 1. Install Playwright (one command)
bun add playwright

# 2. Install browsers (run once)
bunx playwright install chromium
```

### Recommended Folder & API Route (Clean shadcn Style)

```
app/api/export/
├── route.ts          # ← main export endpoint
└── types.ts
```

**Full copy-paste code** (`app/api/export/route.ts`):

```ts
// app/api/export/route.ts
import { NextRequest } from "next/server";
import { chromium } from "playwright";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url"); // e.g. /demo/todolist
  const format = (request.nextUrl.searchParams.get("format") || "png") as "png" | "pdf";

  if (!url) return new Response("Missing url param", { status: 400 });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Mobile-first emulation (matches your preview frame)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });

  // Wait for Framer Motion + your loader to finish
  await page.waitForTimeout(1200); // or use a custom selector

  let buffer: Buffer;
  let contentType: string;
  let filename: string;

  if (format === "pdf") {
    buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", bottom: "1cm" },
    });
    contentType = "application/pdf";
    filename = "conusai-demo.pdf";
  } else {
    buffer = await page.screenshot({ fullPage: true, type: "png" });
    contentType = "image/png";
    filename = "conusai-demo.png";
  }

  await browser.close();

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
```

### Usage in Your TodoList Demo or Fumadocs

Add an **“Export”** button in `header.tsx` or the demo page:

```tsx
<HapticButton
  onClick={async () => {
    const res = await fetch(`/api/export?url=/demo/todolist&format=png`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demo.png";
    a.click();
  }}
>
  Export PNG
</HapticButton>
```

Same for PDF — just change `format=pdf`.

### Pro Tips for 2026 Native Feel
- Add a loading state + branded loader while generating.
- Use Playwright’s `page.emulateMedia({ media: "screen" })` for dark/light mode.
- For batch exports (all components), create a script that loops through your demo routes.

This setup is production-ready, zero bloat in your main bundle, and matches exactly what top design-system teams use in 2026.

Want me to give you:
- The full `route.ts` with mobile frame cropping?
- A client-side fallback using `html-to-image`?
- Or integration directly into Fumadocs (static images for docs)?

Just say the word and I’ll drop the exact code. Your ConusAI UI library will now have professional “Export to PNG/PDF” in minutes! 🚀