import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { DevServiceWorkerReset } from "@/components/dev-service-worker-reset";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://conusai.local"),
  applicationName: "ConusAI UI",
  title: {
    default: "ConusAI UI",
    template: "%s | ConusAI UI",
  },
  description:
    "Mobile-first UI library showcase for ConusAI with a TodoList demo, motion, theming, and PWA-ready metadata.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ConusAI UI",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#09111f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">
        <DevServiceWorkerReset />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
