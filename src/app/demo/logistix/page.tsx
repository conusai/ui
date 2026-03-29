import type { Metadata } from "next";

import LogistixDemo from "@/features/logistix-demo";

export const metadata: Metadata = {
  title: "Logistix AI Demo",
  description:
    "Interactive Logistix AI invoice-management prototype built with ConusAI UI components.",
};

export default function LogistixDemoPage() {
  return <LogistixDemo />;
}
