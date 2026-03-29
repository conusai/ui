"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { ProjectKey } from "./screenshot-config";

type IntelligentScreenshotButtonProps = {
  project?: ProjectKey;
};

export function IntelligentScreenshotButton({
  project = "todolist",
}: IntelligentScreenshotButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAIExport() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/screenshots/intelligent?project=${project}`
      );
      if (!res.ok) {
        throw new Error(`AI Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project}-ai-screenshots.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      disabled={loading}
      onClick={handleAIExport}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <Loader2 className="animate-spin" data-icon="inline-start" />
      ) : (
        <Sparkles data-icon="inline-start" />
      )}
      {loading ? "AI Exploring…" : "AI Explore & Export All Screens"}
    </Button>
  );
}
