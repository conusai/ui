import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

import { source } from "@/lib/docs/source";

export default function DocsLayoutRoot({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RootProvider
      theme={{ enabled: false }}
      search={{
        enabled: true,
        links: [["Todo Demo", "/demo/todolist"]],
      }}
    >
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <span className="font-heading text-sm uppercase tracking-[0.24em]">
              ConusAI Docs
            </span>
          ),
          url: "/docs",
        }}
        links={[
          {
            text: "Todo Demo",
            url: "/demo/todolist",
          },
          {
            type: "button",
            text: "Open Demo",
            url: "/demo/todolist",
          },
        ]}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
