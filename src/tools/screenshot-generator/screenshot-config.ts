export type ProjectKey = keyof typeof screenshotProjects;

export const screenshotProjects = {
  todolist: {
    name: "TodoList Demo",
    seedRoutes: ["/demo/todolist"],
  },
  logistix: {
    name: "Logistix AI Demo",
    seedRoutes: ["/demo/logistix"],
  },
  docs: {
    name: "Component Docs",
    seedRoutes: ["/docs"],
  },
} as const;
