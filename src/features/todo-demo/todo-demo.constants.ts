import { BarChart3, CircleCheckBig, Home, Settings } from "lucide-react";

import type { FooterTab, NavItem } from "@/components/conusai-ui";

import type {
  PreviewModeOption,
  Todo,
  TodoFilterItem,
} from "./todo-demo.types";

export const languages = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "lt", label: "Lithuanian", flag: "🇱🇹" },
  { value: "de", label: "German", flag: "🇩🇪" },
];

export const filterItems: TodoFilterItem[] = [
  { id: "today", label: "Today", meta: "07" },
  { id: "all", label: "All Tasks", meta: "14" },
  { id: "focus", label: "Deep Focus", meta: "03" },
  { id: "done", label: "Completed", meta: "09" },
];

export const footerTabs: FooterTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: CircleCheckBig },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const appNavItems: NavItem[] = footerTabs.map((tab) => ({
  id: tab.id,
  label: tab.label,
  icon: tab.icon,
}));

export const previewModes: PreviewModeOption[] = [
  { id: "mobile", label: "Mobile", caption: "Single-hand PWA flow" },
  { id: "tablet", label: "Tablet", caption: "Two-column workspace" },
  { id: "desktop", label: "Desktop", caption: "Full control center" },
];

export const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Refine mobile preview frame",
    description: "Tune the bezel proportions, inner radius, and motion timing.",
    priority: "High",
    done: false,
    bucket: "today",
    dueLabel: "09:30",
  },
  {
    id: "2",
    title: "Wire language picker",
    description:
      "Support mobile sheet and desktop dropdown with semantic tokens.",
    priority: "Medium",
    done: false,
    bucket: "focus",
    dueLabel: "11:00",
  },
  {
    id: "3",
    title: "Audit dark mode contrast",
    description:
      "Check footer tabs, cards, and overlay readability on dark surfaces.",
    priority: "Medium",
    done: false,
    bucket: "backlog",
    dueLabel: "13:15",
  },
  {
    id: "4",
    title: "Ship installable demo",
    description:
      "Verify manifest, theme color, and service worker generation path.",
    priority: "High",
    done: true,
    bucket: "done",
    dueLabel: "Complete",
  },
];
