import type { FooterTab, NavItem, PreviewMode } from "@/components/conusai-ui";

export type TodoPriority = "Low" | "Medium" | "High";

export type TodoBucket = "today" | "focus" | "backlog" | "done";

export type TodoFilterId = "today" | "all" | "focus" | "done";

export type TodoAppTabId = "home" | "tasks" | "stats" | "settings";

export type Todo = {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  done: boolean;
  bucket: TodoBucket;
  dueLabel: string;
};

export type TodoFilterItem = {
  id: TodoFilterId;
  label: string;
  meta: string;
};

export type PreviewModeOption = {
  id: PreviewMode;
  label: string;
  caption: string;
};

export type TodoSummary = {
  openCount: number;
  focusCount: number;
  completedCount: number;
};

export type TodoDemoState = {
  language: string;
  leftOpen: boolean;
  activeNav: TodoFilterId;
  activeTab: TodoAppTabId;
  previewMode: PreviewMode;
  searchQuery: string;
  draftTitle: string;
  todos: Todo[];
  selectedId: string | null;
  selectedTodo: Todo | null;
  inspectorOpen: boolean;
  showLoader: boolean;
  visibleTodos: Todo[];
  currentFilterLabel: string;
  summary: TodoSummary;
  isMobilePreview: boolean;
  isDesktopPreview: boolean;
};

export type TodoDemoActions = {
  setLanguage: (value: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setSearchQuery: (value: string) => void;
  setDraftTitle: (value: string) => void;
  toggleLeftSidebar: () => void;
  closeLeftSidebar: () => void;
  selectAppTab: (id: TodoAppTabId) => void;
  selectFilter: (id: TodoFilterId) => void;
  addTodo: () => void;
  openInspector: (id: string) => void;
  closeInspector: () => void;
  toggleTodo: (id: string) => void;
  updateSelected: (patch: Partial<Todo>) => void;
  deleteSelected: () => void;
};

export type TodoDemoController = TodoDemoState & TodoDemoActions;

export type TodoDemoLibraryConfig = {
  footerTabs: FooterTab[];
  appNavItems: NavItem[];
  previewModes: PreviewModeOption[];
  filterItems: TodoFilterItem[];
  languages: Array<{ value: string; label: string; flag: string }>;
};
