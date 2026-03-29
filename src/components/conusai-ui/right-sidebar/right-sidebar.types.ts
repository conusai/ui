import type { ComponentPropsWithoutRef } from "react";

export type EditableTodo = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};

export type RightSidebarProps = Omit<
  ComponentPropsWithoutRef<"aside">,
  "onChange" | "onDelete"
> & {
  open: boolean;
  todo: EditableTodo | null;
  onClose: () => void;
  onChange: (patch: Partial<EditableTodo>) => void;
  onDelete: () => void;
  variant?: "overlay" | "inline";
};
