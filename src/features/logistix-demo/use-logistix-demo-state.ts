"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PreviewMode } from "@/components/conusai-ui";
import { useMinimumDelay } from "@/hooks/use-minimum-delay";
import { useVibrate } from "@/hooks/use-vibrate";

import {
  inboxSeedInvoices,
  initialInvoices,
  initialSettings,
} from "./logistix-demo.constants";
import type {
  InvoiceChannel,
  InvoiceStatus,
  InvoiceStatusFilter,
  LogisticsInvoice,
  LogistixAppTabId,
  LogistixDemoController,
  LogistixSettings,
  UploadQueueItem,
} from "./logistix-demo.types";

function createInvoiceReference(seed: number) {
  return `LGX-${String(seed).padStart(4, "0")}`;
}

function createInvoiceNumber(seed: number) {
  return `AI-${new Date().getFullYear()}-${String(seed).padStart(5, "0")}`;
}

function createGeneratedInvoice(
  seed: number,
  fileName: string,
  channel: InvoiceChannel,
  template?: Partial<
    Pick<
      LogisticsInvoice,
      | "vendor"
      | "customerName"
      | "route"
      | "amount"
      | "currency"
      | "tags"
      | "lineItems"
    >
  >
): LogisticsInvoice {
  const baseAmount = template?.amount ?? 980 + seed * 15;
  const currency = template?.currency ?? "EUR";

  return {
    id: crypto.randomUUID(),
    reference: createInvoiceReference(seed),
    vendor: template?.vendor ?? fileName.replace(/\.[^.]+$/, ""),
    customerName: template?.customerName ?? "Logistix Demo Account",
    route: template?.route ?? "Hamburg -> Prague",
    amount: baseAmount,
    currency,
    invoiceNumber: createInvoiceNumber(seed),
    issueDate: "2026-03-29",
    dueDate: "2026-04-14",
    confidence: 76,
    status: "processing",
    channel,
    notes: `AI extraction queued from ${channel} source.`,
    tags: template?.tags ?? [channel, "new intake"],
    lineItems: template?.lineItems ?? [
      {
        id: crypto.randomUUID(),
        label: "Freight charge",
        quantity: 1,
        unitPrice: baseAmount,
        total: baseAmount,
      },
    ],
  };
}

function nextSettledStatus(seed: number): InvoiceStatus {
  return seed % 4 === 0 ? "review" : "ready";
}

export function useLogistixDemoState(): LogistixDemoController {
  const [language, setLanguage] = useState("en");
  const [leftOpen, setLeftOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LogistixAppTabId>("upload");
  const [previewMode, setPreviewModeState] = useState<PreviewMode>("mobile");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [settings, setSettings] = useState(initialSettings);
  const [selectedReinvoiceIds, setSelectedReinvoiceIds] = useState<string[]>(
    initialInvoices
      .filter((invoice) => invoice.status === "ready")
      .slice(0, 2)
      .map((invoice) => invoice.id)
  );
  const [marginPercent, setMarginPercentState] = useState(
    initialSettings.defaultMargin
  );
  const [booting, setBooting] = useState(true);

  const deferredQuery = useDeferredValue(searchQuery);
  const showLoader = useMinimumDelay(booting, 1000);
  const vibrate = useVibrate();
  const isMobilePreview = previewMode === "mobile";
  const isDesktopPreview = previewMode === "desktop";
  const sequenceRef = useRef(900);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setBooting(false), 120);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIdsRef.current) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    setLeftOpen(previewMode !== "mobile");
    if (previewMode === "mobile") {
      setInspectorOpen(false);
    }
  }, [previewMode]);

  const selectedInvoice =
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;

  const visibleInvoices = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesQuery = normalizedQuery
        ? `${invoice.vendor} ${invoice.customerName} ${invoice.reference} ${invoice.route}`
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : invoice.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [deferredQuery, invoices, statusFilter]);

  const summary = useMemo(() => {
    const readyCount = invoices.filter(
      (invoice) => invoice.status === "ready"
    ).length;
    const processingCount = invoices.filter(
      (invoice) => invoice.status === "processing" || invoice.status === "new"
    ).length;
    const flaggedCount = invoices.filter(
      (invoice) => invoice.status === "review"
    ).length;
    const totalRecovered = invoices
      .filter((invoice) => invoice.status === "ready")
      .reduce((total, invoice) => total + invoice.amount, 0);

    return {
      totalInvoices: invoices.length,
      readyCount,
      processingCount,
      flaggedCount,
      totalRecovered,
    };
  }, [invoices]);

  function queueTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutIdsRef.current.push(timeoutId);
  }

  function settleInvoice(invoiceId: string, seed: number) {
    queueTimeout(() => {
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === invoiceId
            ? {
                ...invoice,
                status: nextSettledStatus(seed),
                confidence: 86 + (seed % 11),
                notes:
                  nextSettledStatus(seed) === "review"
                    ? "Extraction completed, but a line-item mismatch needs review."
                    : "Extraction completed and ready for re-invoicing.",
              }
            : invoice
        )
      );
      setUploadQueue((current) =>
        current.map((item) =>
          item.id === invoiceId
            ? { ...item, progress: 100, status: "complete" }
            : item
        )
      );
    }, 1650);
  }

  function simulateUpload(fileName: string, channel: InvoiceChannel) {
    const seed = ++sequenceRef.current;
    const invoice = createGeneratedInvoice(seed, fileName, channel);

    vibrate([10, 24, 10]);
    startTransition(() => setActiveTab("upload"));
    setUploadQueue((current) => [
      {
        id: invoice.id,
        fileName,
        channel,
        progress: 8,
        status: "uploading",
      },
      ...current,
    ]);
    setInvoices((current) => [invoice, ...current]);
    setSelectedInvoiceId(invoice.id);

    queueTimeout(() => {
      setUploadQueue((current) =>
        current.map((item) =>
          item.id === invoice.id ? { ...item, progress: 42 } : item
        )
      );
    }, 240);

    queueTimeout(() => {
      setUploadQueue((current) =>
        current.map((item) =>
          item.id === invoice.id
            ? { ...item, progress: 74, status: "processing" }
            : item
        )
      );
      setInvoices((current) =>
        current.map((entry) =>
          entry.id === invoice.id ? { ...entry, status: "processing" } : entry
        )
      );
    }, 820);

    settleInvoice(invoice.id, seed);
  }

  function syncInbox() {
    if (!settings.gmailConnected) {
      setSettings((current) => ({ ...current, gmailConnected: true }));
    }

    vibrate([16, 28, 16]);
    startTransition(() => setActiveTab("invoices"));

    inboxSeedInvoices.forEach((template, index) => {
      const seed = ++sequenceRef.current;
      const invoice = createGeneratedInvoice(
        seed,
        `${template.vendor} email ${index + 1}.pdf`,
        "email",
        template
      );

      setUploadQueue((current) => [
        {
          id: invoice.id,
          fileName: `${template.vendor}.pdf`,
          channel: "email",
          progress: 24,
          status: "processing",
        },
        ...current,
      ]);
      setInvoices((current) => [invoice, ...current]);
      settleInvoice(invoice.id, seed);
    });
  }

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

  function selectAppTab(id: LogistixAppTabId) {
    vibrate(14);
    startTransition(() => setActiveTab(id));
    setLeftOpen(false);
  }

  function openInvoice(id: string) {
    vibrate(18);
    setSelectedInvoiceId(id);
    setInspectorOpen(true);
    startTransition(() => setActiveTab("invoices"));
  }

  function closeInspector() {
    setInspectorOpen(false);
  }

  function updateSelectedInvoice(patch: Partial<LogisticsInvoice>) {
    if (!selectedInvoiceId) {
      return;
    }

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoiceId ? { ...invoice, ...patch } : invoice
      )
    );
  }

  function removeSelectedInvoice() {
    if (!selectedInvoiceId) {
      return;
    }

    vibrate([10, 20, 10]);
    setInvoices((current) =>
      current.filter((invoice) => invoice.id !== selectedInvoiceId)
    );
    setSelectedReinvoiceIds((current) =>
      current.filter((id) => id !== selectedInvoiceId)
    );
    setSelectedInvoiceId(null);
    setInspectorOpen(false);
  }

  function updateSettings<K extends keyof LogistixSettings>(
    field: K,
    value: LogistixSettings[K]
  ) {
    setSettings((current) => ({ ...current, [field]: value }));

    if (field === "defaultMargin") {
      setMarginPercentState(Number(value));
    }
  }

  function toggleReinvoice(id: string) {
    vibrate(10);
    setSelectedReinvoiceIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id]
    );
  }

  function setMarginPercent(value: number) {
    setMarginPercentState(value);
  }

  return {
    language,
    leftOpen,
    activeTab,
    previewMode,
    searchQuery,
    statusFilter,
    invoices,
    visibleInvoices,
    selectedInvoiceId,
    selectedInvoice,
    inspectorOpen,
    uploadQueue,
    settings,
    selectedReinvoiceIds,
    marginPercent,
    showLoader,
    isMobilePreview,
    isDesktopPreview,
    summary,
    setLanguage,
    setPreviewMode,
    setSearchQuery,
    setStatusFilter,
    toggleLeftSidebar,
    closeLeftSidebar,
    selectAppTab,
    openInvoice,
    closeInspector,
    updateSelectedInvoice,
    removeSelectedInvoice,
    simulateUpload,
    syncInbox,
    updateSettings,
    toggleReinvoice,
    setMarginPercent,
  };
}
