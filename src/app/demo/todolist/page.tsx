import type { Metadata } from "next";

import { TodoListDemo } from "@/features/todo-demo/todo-list-demo";

export const metadata: Metadata = {
  title: "TodoList Demo",
  description:
    "Interactive ConusAI TodoList demo showing the UI library in a mobile preview frame.",
};

export default function TodoListDemoPage() {
  return <TodoListDemo />;
}
