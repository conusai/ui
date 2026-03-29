"use client";

import { LogistixDemoShell } from "./logistix-demo-shell";
import { useLogistixDemoState } from "./use-logistix-demo-state";

export function LogistixDemo() {
  const demo = useLogistixDemoState();

  return <LogistixDemoShell demo={demo} />;
}

export default LogistixDemo;
