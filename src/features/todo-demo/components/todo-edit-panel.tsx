"use client";

import { cva } from "class-variance-authority";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { Todo } from "../todo-demo.types";

const priorityVariants = cva(
  "touch-target rounded-2xl border px-3 py-2 text-sm font-medium",
  {
    variants: {
      active: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "border-border bg-background hover:bg-muted",
      },
    },
  }
);

type TodoEditPanelProps = {
  todo: Todo;
  onChange: (patch: Partial<Todo>) => void;
  onDelete?: () => void;
};

export function TodoEditPanel({
  todo,
  onChange,
  onDelete,
}: TodoEditPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {onDelete ? (
        <div className="mb-3 flex justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label="Delete task"
            className="touch-target"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            value={todo.title}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-description">Description</Label>
          <textarea
            id="task-description"
            value={todo.description}
            onChange={(event) => onChange({ description: event.target.value })}
            className="min-h-32 w-full rounded-[1.15rem] border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["Low", "Medium", "High"] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => onChange({ priority })}
                className={cn(
                  priorityVariants({ active: todo.priority === priority })
                )}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto rounded-[1.4rem] border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
        Editing stays local to the demo. This panel exists to prove the
        component library can handle focused, detail-heavy workflows across
        device sizes.
      </div>
    </div>
  );
}
