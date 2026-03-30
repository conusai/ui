import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type EditableTodo = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};

export type RightSidebarProps = Omit<
  ComponentPropsWithoutRef<"aside">,
  "onChange" | "onDelete" | "children"
> & {
  open: boolean;
  todo?: EditableTodo | null;
  onClose: () => void;
  onChange?: (patch: Partial<EditableTodo>) => void;
  onDelete?: () => void;
  variant?: "overlay" | "inline";
  panelEyebrow?: string;
  panelTitle?: string;
  backLabel?: string;
  showDeleteButton?: boolean;
  backButtonAsChild?: boolean;
  backButtonChild?: ReactNode;
  deleteButtonAsChild?: boolean;
  deleteButtonChild?: ReactNode;
  deleteButtonLabel?: string;
  emptyState?: ReactNode;
  children?: ReactNode;
};
