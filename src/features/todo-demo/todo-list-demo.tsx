"use client";

import { TodoDemoShell } from "./todo-demo-shell";
import { useTodoDemoState } from "./use-todo-demo-state";

export function TodoListDemo() {
  const demo = useTodoDemoState();

  return <TodoDemoShell demo={demo} />;
}
