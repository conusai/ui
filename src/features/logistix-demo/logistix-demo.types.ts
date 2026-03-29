import type { FooterTab, NavItem, PreviewMode } from "@/components/conusai-ui";

export type LogistixAppTabId = "upload" | "invoices" | "reinvoice" | "settings";

export type InvoiceStatus = "new" | "processing" | "review" | "ready";

export type InvoiceStatusFilter = "all" | InvoiceStatus;

export type InvoiceChannel = "upload" | "camera" | "email";

export type InvoiceLineItem = {
  id: string;
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type LogisticsInvoice = {
  id: string;
  reference: string;
  vendor: string;
  customerName: string;
  route: string;
  amount: number;
  currency: "EUR" | "USD";
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  confidence: number;
  status: InvoiceStatus;
  channel: InvoiceChannel;
  notes: string;
  tags: string[];
  lineItems: InvoiceLineItem[];
};

export type UploadQueueStatus = "uploading" | "processing" | "complete";

export type UploadQueueItem = {
  id: string;
  fileName: string;
  channel: InvoiceChannel;
  progress: number;
  status: UploadQueueStatus;
};

export type LogistixSettings = {
  gmailConnected: boolean;
  accountantEmail: string;
  templateName: string;
  senderCompany: string;
  replyTo: string;
  defaultMargin: number;
};

export type PreviewModeOption = {
  id: PreviewMode;
  label: string;
  caption: string;
};

export type LogistixSummary = {
  totalInvoices: number;
  readyCount: number;
  processingCount: number;
  flaggedCount: number;
  totalRecovered: number;
};

export type LogistixDemoState = {
  language: string;
  leftOpen: boolean;
  activeTab: LogistixAppTabId;
  previewMode: PreviewMode;
  searchQuery: string;
  statusFilter: InvoiceStatusFilter;
  invoices: LogisticsInvoice[];
  visibleInvoices: LogisticsInvoice[];
  selectedInvoiceId: string | null;
  selectedInvoice: LogisticsInvoice | null;
  inspectorOpen: boolean;
  uploadQueue: UploadQueueItem[];
  settings: LogistixSettings;
  selectedReinvoiceIds: string[];
  marginPercent: number;
  showLoader: boolean;
  isMobilePreview: boolean;
  isDesktopPreview: boolean;
  summary: LogistixSummary;
};

export type LogistixDemoActions = {
  setLanguage: (value: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: InvoiceStatusFilter) => void;
  toggleLeftSidebar: () => void;
  closeLeftSidebar: () => void;
  selectAppTab: (id: LogistixAppTabId) => void;
  openInvoice: (id: string) => void;
  closeInspector: () => void;
  updateSelectedInvoice: (patch: Partial<LogisticsInvoice>) => void;
  removeSelectedInvoice: () => void;
  simulateUpload: (fileName: string, channel: InvoiceChannel) => void;
  syncInbox: () => void;
  updateSettings: <K extends keyof LogistixSettings>(
    field: K,
    value: LogistixSettings[K]
  ) => void;
  toggleReinvoice: (id: string) => void;
  setMarginPercent: (value: number) => void;
};

export type LogistixDemoController = LogistixDemoState & LogistixDemoActions;

export type LogistixDemoLibraryConfig = {
  footerTabs: FooterTab[];
  appNavItems: NavItem[];
  previewModes: PreviewModeOption[];
  languages: Array<{ value: string; label: string; flag: string }>;
};
