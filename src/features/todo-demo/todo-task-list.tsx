"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Circle,
  CircleCheckBig,
  Plus,
  Search,
} from "lucide-react";

import { createFadeUpVariants, createTapMotion } from "@/components/conusai-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import { filterItems } from "./todo-demo.constants";
import type { Todo, TodoDemoController } from "./todo-demo.types";

type TodoTaskListProps = {
  demo: TodoDemoController;
};

function priorityTone(priority: Todo["priority"]) {
  if (priority === "High") {
    return "bg-destructive/12 text-destructive";
  }

  if (priority === "Medium") {
    return "bg-[color:var(--conus-sun)]/18 text-foreground";
  }

  return "bg-[color:var(--conus-aurora)]/16 text-foreground";
}

export function TodoTaskList({ demo }: TodoTaskListProps) {
  const shouldReduceMotion = useReducedMotionPreference();
  const fadeUpVariants = createFadeUpVariants(shouldReduceMotion);
  const tapMotion = createTapMotion(shouldReduceMotion);

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-5">
      <div className="rounded-[1.8rem] border border-border/70 bg-card/78 p-4 shadow-[0_24px_70px_-40px_rgba(10,16,31,0.5)] backdrop-blur-xl">
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            !demo.isMobilePreview && "flex-wrap"
          )}
        >
          <div>
            <p className="text-sm text-muted-foreground">
              {demo.currentFilterLabel} queue
            </p>
            <h2 className="font-heading text-2xl">Ship with clarity</h2>
          </div>
          <div className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
            {demo.visibleTodos.length} live
          </div>
        </div>

        <div
          className={cn(
            "mt-4 grid gap-3",
            demo.isMobilePreview ? "" : "lg:grid-cols-[minmax(0,1fr)_auto]"
          )}
        >
          <div className="flex flex-wrap gap-2 lg:col-span-2">
            {filterItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => demo.selectFilter(item.id)}
                aria-pressed={demo.activeNav === item.id}
                className={cn(
                  "touch-target inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                  demo.activeNav === item.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.68rem]",
                    demo.activeNav === item.id
                      ? "bg-primary-foreground/16 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.meta}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-[1.35rem] border border-border/70 bg-background/85 px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={demo.searchQuery}
              onChange={(event) => demo.setSearchQuery(event.target.value)}
              placeholder="Search tasks or notes"
              className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1 rounded-[1.35rem] border border-border/70 bg-background/85 px-3 py-2">
              <Input
                value={demo.draftTitle}
                onChange={(event) => demo.setDraftTitle(event.target.value)}
                placeholder="Add a new task"
                className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button
              onClick={demo.addTodo}
              className="touch-target rounded-[1.35rem] px-4"
            >
              <Plus />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <AnimatePresence initial={false} mode="popLayout">
          {demo.visibleTodos.map((todo, index) => (
            <motion.article
              key={todo.id}
              layout
              custom={index}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            >
              <motion.div
                layout
                {...tapMotion}
                onClick={() => {
                  demo.openInspector(todo.id);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") {
                    return;
                  }

                  event.preventDefault();
                  demo.openInspector(todo.id);
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  "w-full rounded-[1.7rem] border p-4 text-left shadow-[0_18px_48px_-36px_rgba(10,16,31,0.45)] backdrop-blur",
                  !demo.isMobilePreview && "sm:p-5",
                  demo.selectedId === todo.id
                    ? "border-primary/40 bg-card"
                    : "border-border/70 bg-card/72"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      demo.toggleTodo(todo.id);
                    }}
                    className="touch-target mt-0.5 text-primary"
                    aria-label={
                      todo.done ? "Mark task incomplete" : "Mark task complete"
                    }
                  >
                    {todo.done ? (
                      <CircleCheckBig className="size-5" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={cn(
                          "truncate text-sm font-semibold",
                          !demo.isMobilePreview && "text-base",
                          todo.done && "text-muted-foreground line-through"
                        )}
                      >
                        {todo.title}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[0.68rem] font-medium",
                          priorityTone(todo.priority)
                        )}
                      >
                        {todo.priority}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {todo.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{todo.dueLabel}</span>
                      <div className="flex items-center gap-3">
                        <span>
                          {demo.selectedId === todo.id && demo.inspectorOpen
                            ? "Inspector open"
                            : todo.done
                              ? "Completed"
                              : "Tap to inspect"}
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            demo.openInspector(todo.id);
                          }}
                          className="touch-target inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                        >
                          Edit
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </AnimatePresence>

        {demo.visibleTodos.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-border/80 bg-card/60 p-6 text-center text-sm text-muted-foreground">
            No tasks match this view yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
