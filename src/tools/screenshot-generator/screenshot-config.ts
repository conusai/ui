export type ProjectKey = keyof typeof screenshotProjects;

export const screenshotProjects = {
  todolist: {
    name: "TodoList Demo",
    seedRoutes: ["/demo/todolist"],
  },
  docs: {
    name: "Component Docs",
    seedRoutes: ["/docs"],
  },
} as const;
