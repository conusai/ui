import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},
  serverExternalPackages: ["playwright", "adm-zip"],
};

export default withMDX(
  withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  })(nextConfig)
);
