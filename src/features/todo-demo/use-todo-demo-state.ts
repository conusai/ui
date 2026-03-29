"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PreviewMode } from "@/components/conusai-ui";
import { useMinimumDelay } from "@/hooks/use-minimum-delay";
import { useVibrate } from "@/hooks/use-vibrate";

import { filterItems, initialTodos } from "./todo-demo.constants";
import type {
  Todo,
  TodoAppTabId,
  TodoDemoController,
  TodoFilterId,
} from "./todo-demo.types";

function getNextTodoBucket(activeNav: TodoFilterId): Todo["bucket"] {
  if (activeNav === "today" || activeNav === "focus") {
    return activeNav;
  }

  if (activeNav === "done") {
    return "today";
  }

  return "backlog";
}

export function useTodoDemoState(): TodoDemoController {
  const [language, setLanguage] = useState("en");
  const [leftOpen, setLeftOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<TodoFilterId>("today");
  const [activeTab, setActiveTab] = useState<TodoAppTabId>("tasks");
  const [previewMode, setPreviewModeState] = useState<PreviewMode>("mobile");
  const [searchQuery, setSearchQuery] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [todos, setTodos] = useState(initialTodos);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  const deferredQuery = useDeferredValue(searchQuery);
  const showLoader = useMinimumDelay(booting, 1000);
  const vibrate = useVibrate();
  const isMobilePreview = previewMode === "mobile";
  const isDesktopPreview = previewMode === "desktop";

  useEffect(() => {
    const timeout = window.setTimeout(() => setBooting(false), 120);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setLeftOpen(previewMode !== "mobile");
    setInspectorOpen(false);
  }, [previewMode]);

  const selectedTodo = todos.find((todo) => todo.id === selectedId) ?? null;

  const visibleTodos = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesBucket =
        activeNav === "all"
          ? true
          : activeNav === "done"
            ? todo.done
            : todo.bucket === activeNav;
      const matchesSearch = normalizedQuery
        ? `${todo.title} ${todo.description}`
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesBucket && matchesSearch;
    });
  }, [activeNav, deferredQuery, todos]);

  const completedCount = todos.filter((todo) => todo.done).length;
  const focusCount = todos.filter(
    (todo) => todo.priority === "High" && !todo.done
  ).length;
  const currentFilterLabel =
    filterItems.find((item) => item.id === activeNav)?.label ?? "Today";

  function setPreviewMode(mode: PreviewMode) {
    vibrate(12);
    startTransition(() => setPreviewModeState(mode));
  }

  function toggleLeftSidebar() {
    vibrate(12);
    setLeftOpen((current) => !current);
  }

  function closeLeftSidebar() {
    setLeftOpen(false);
  }

  function selectAppTab(id: TodoAppTabId) {
    vibrate(14);
    startTransition(() => setActiveTab(id));
    setLeftOpen(false);
  }

  function selectFilter(id: TodoFilterId) {
    vibrate(14);
    startTransition(() => setActiveNav(id));
  }

  function addTodo() {
    const title = draftTitle.trim();

    if (!title) {
      return;
    }

    vibrate([10, 18, 10]);

    const nextTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description: "Freshly added from the demo composer.",
      priority: "Low",
      done: false,
      bucket: getNextTodoBucket(activeNav),
      dueLabel: "Later",
    };

    setTodos((current) => [nextTodo, ...current]);
    setDraftTitle("");
    setSelectedId(nextTodo.id);
    setInspectorOpen(true);
  }

  function openInspector(id: string) {
    vibrate(18);
    setSelectedId(id);
    setInspectorOpen(true);
  }

  function closeInspector() {
    setInspectorOpen(false);
  }

  function toggleTodo(id: string) {
    vibrate(16);
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              done: !todo.done,
              bucket: !todo.done
                ? "done"
                : todo.bucket === "done"
                  ? "today"
                  : todo.bucket,
            }
          : todo
      )
    );
  }

  function updateSelected(patch: Partial<Todo>) {
    if (!selectedId) {
      return;
    }

    setTodos((current) =>
      current.map((todo) =>
        todo.id === selectedId ? { ...todo, ...patch } : todo
      )
    );
  }

  function deleteSelected() {
    if (!selectedId) {
      return;
    }

    vibrate([12, 24, 8]);
    setTodos((current) => current.filter((todo) => todo.id !== selectedId));
    setSelectedId(null);
    setInspectorOpen(false);
  }

  return {
    language,
    leftOpen,
    activeNav,
    activeTab,
    previewMode,
    searchQuery,
    draftTitle,
    todos,
    selectedId,
    selectedTodo,
    inspectorOpen,
    showLoader,
    visibleTodos,
    currentFilterLabel,
    summary: {
      openCount: todos.length - completedCount,
      focusCount,
      completedCount,
    },
    isMobilePreview,
    isDesktopPreview,
    setLanguage,
    setPreviewMode,
    setSearchQuery,
    setDraftTitle,
    toggleLeftSidebar,
    closeLeftSidebar,
    selectAppTab,
    selectFilter,
    addTodo,
    openInspector,
    closeInspector,
    toggleTodo,
    updateSelected,
    deleteSelected,
  };
}
