import { FileText, Mail, RefreshCcw, Settings2, Upload } from "lucide-react";

import type { FooterTab, NavItem } from "@/components/conusai-ui";

import type {
  LogisticsInvoice,
  LogistixSettings,
  PreviewModeOption,
} from "./logistix-demo.types";

export const languages = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "pl", label: "Polish", flag: "🇵🇱" },
];

export const footerTabs: FooterTab[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reinvoice", label: "Re-Invoice", icon: RefreshCcw },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export const appNavItems: NavItem[] = footerTabs.map((tab) => ({
  id: tab.id,
  label: tab.label,
  icon: tab.icon,
}));

export const previewModes: PreviewModeOption[] = [
  { id: "mobile", label: "Mobile", caption: "Thumb-first field workflow" },
  { id: "tablet", label: "Tablet", caption: "Split review workspace" },
  { id: "desktop", label: "Desktop", caption: "Finance operations view" },
];

export const initialSettings: LogistixSettings = {
  gmailConnected: false,
  accountantEmail: "ap@logistix.ai",
  templateName: "Carrier Margin v2",
  senderCompany: "Logistix AI GmbH",
  replyTo: "billing@logistix.ai",
  defaultMargin: 8,
};

export const initialInvoices: LogisticsInvoice[] = [
  {
    id: "inv-001",
    reference: "HAM-RTM-042",
    vendor: "Baltic Freight GmbH",
    customerName: "North Port Retail",
    route: "Hamburg -> Rotterdam",
    amount: 1840,
    currency: "EUR",
    invoiceNumber: "BFG-2026-0418",
    issueDate: "2026-03-25",
    dueDate: "2026-04-12",
    confidence: 96,
    status: "ready",
    channel: "upload",
    notes:
      "Fuel surcharge extracted from page 2 and matched against contract lane.",
    tags: ["ocean", "fuel surcharge", "matched"],
    lineItems: [
      {
        id: "1",
        label: "Container move",
        quantity: 1,
        unitPrice: 1320,
        total: 1320,
      },
      {
        id: "2",
        label: "Fuel surcharge",
        quantity: 1,
        unitPrice: 280,
        total: 280,
      },
      {
        id: "3",
        label: "Port handling",
        quantity: 1,
        unitPrice: 240,
        total: 240,
      },
    ],
  },
  {
    id: "inv-002",
    reference: "GDN-VNO-310",
    vendor: "NordRail Cargo",
    customerName: "Vilnius Distribution Hub",
    route: "Gdansk -> Vilnius",
    amount: 1265,
    currency: "EUR",
    invoiceNumber: "NRC-90813",
    issueDate: "2026-03-26",
    dueDate: "2026-04-08",
    confidence: 88,
    status: "review",
    channel: "email",
    notes:
      "PO number missing in source email thread. Review consignee before re-invoicing.",
    tags: ["rail", "missing po", "review"],
    lineItems: [
      {
        id: "1",
        label: "Rail line haul",
        quantity: 1,
        unitPrice: 980,
        total: 980,
      },
      {
        id: "2",
        label: "Terminal fee",
        quantity: 1,
        unitPrice: 285,
        total: 285,
      },
    ],
  },
  {
    id: "inv-003",
    reference: "KLP-RIX-118",
    vendor: "Harbor Customs OU",
    customerName: "Baltic Consumer Goods",
    route: "Klaipeda -> Riga",
    amount: 640,
    currency: "EUR",
    invoiceNumber: "HCO-5512",
    issueDate: "2026-03-24",
    dueDate: "2026-04-06",
    confidence: 91,
    status: "ready",
    channel: "camera",
    notes: "Customs clearance and document stamp extracted from mobile scan.",
    tags: ["customs", "mobile scan"],
    lineItems: [
      { id: "1", label: "Broker fee", quantity: 1, unitPrice: 420, total: 420 },
      {
        id: "2",
        label: "Inspection filing",
        quantity: 1,
        unitPrice: 220,
        total: 220,
      },
    ],
  },
  {
    id: "inv-004",
    reference: "MRS-LYS-227",
    vendor: "TransitFlow SAS",
    customerName: "Rhone Pharma",
    route: "Marseille -> Lyon",
    amount: 2290,
    currency: "EUR",
    invoiceNumber: "TF-77840",
    issueDate: "2026-03-23",
    dueDate: "2026-04-05",
    confidence: 84,
    status: "review",
    channel: "upload",
    notes:
      "Temperature-control surcharge detected, but contract lane mapping is low confidence.",
    tags: ["cold chain", "surcharge"],
    lineItems: [
      {
        id: "1",
        label: "Reefer line haul",
        quantity: 1,
        unitPrice: 1980,
        total: 1980,
      },
      {
        id: "2",
        label: "Temperature surcharge",
        quantity: 1,
        unitPrice: 310,
        total: 310,
      },
    ],
  },
  {
    id: "inv-005",
    reference: "LAX-DFW-992",
    vendor: "SkyBridge Cargo",
    customerName: "US West Importers",
    route: "Los Angeles -> Dallas",
    amount: 3120,
    currency: "USD",
    invoiceNumber: "SBC-2026-992",
    issueDate: "2026-03-22",
    dueDate: "2026-04-09",
    confidence: 94,
    status: "ready",
    channel: "email",
    notes:
      "Air cargo uplift verified against shipment manifest and customs release.",
    tags: ["air cargo", "manifest matched"],
    lineItems: [
      {
        id: "1",
        label: "Air uplift",
        quantity: 1,
        unitPrice: 2780,
        total: 2780,
      },
      {
        id: "2",
        label: "Screening fee",
        quantity: 1,
        unitPrice: 340,
        total: 340,
      },
    ],
  },
  {
    id: "inv-006",
    reference: "RTM-PRG-615",
    vendor: "EuroTruck Ops",
    customerName: "Prague Home Goods",
    route: "Rotterdam -> Prague",
    amount: 1495,
    currency: "EUR",
    invoiceNumber: "ETO-61544",
    issueDate: "2026-03-21",
    dueDate: "2026-04-04",
    confidence: 79,
    status: "processing",
    channel: "upload",
    notes: "OCR still reconciling multi-page pallet notes.",
    tags: ["truckload", "ocr running"],
    lineItems: [
      { id: "1", label: "FTL lane", quantity: 1, unitPrice: 1495, total: 1495 },
    ],
  },
  {
    id: "inv-007",
    reference: "ANR-MXP-703",
    vendor: "CargoNet Benelux",
    customerName: "Milan Parts SRL",
    route: "Antwerp -> Milan",
    amount: 2088,
    currency: "EUR",
    invoiceNumber: "CNB-70315",
    issueDate: "2026-03-20",
    dueDate: "2026-04-03",
    confidence: 90,
    status: "ready",
    channel: "upload",
    notes:
      "Lane-level margin already exceeds threshold. Good re-invoice candidate.",
    tags: ["margin ready", "road freight"],
    lineItems: [
      {
        id: "1",
        label: "Road freight",
        quantity: 1,
        unitPrice: 1850,
        total: 1850,
      },
      {
        id: "2",
        label: "Cross-border docs",
        quantity: 1,
        unitPrice: 238,
        total: 238,
      },
    ],
  },
  {
    id: "inv-008",
    reference: "VNO-TLL-844",
    vendor: "Mailroom Imports",
    customerName: "Tallinn Retail Labs",
    route: "Vilnius -> Tallinn",
    amount: 905,
    currency: "EUR",
    invoiceNumber: "MI-84421",
    issueDate: "2026-03-27",
    dueDate: "2026-04-10",
    confidence: 82,
    status: "new",
    channel: "email",
    notes: "Fresh inbox capture awaiting extraction kickoff.",
    tags: ["new email", "awaiting ai"],
    lineItems: [
      {
        id: "1",
        label: "Regional delivery",
        quantity: 1,
        unitPrice: 905,
        total: 905,
      },
    ],
  },
];

export const inboxSeedInvoices: Array<
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
> = [
  {
    vendor: "Mailroom Imports",
    customerName: "Tallinn Retail Labs",
    route: "Vilnius -> Tallinn",
    amount: 905,
    currency: "EUR",
    tags: ["email", "fresh intake"],
    lineItems: [
      {
        id: "1",
        label: "Regional delivery",
        quantity: 1,
        unitPrice: 905,
        total: 905,
      },
    ],
  },
  {
    vendor: "PortLine Agency",
    customerName: "Stockholm Fashion AB",
    route: "Gothenburg -> Stockholm",
    amount: 1188,
    currency: "EUR",
    tags: ["email", "port charges"],
    lineItems: [
      {
        id: "1",
        label: "Port service fee",
        quantity: 1,
        unitPrice: 488,
        total: 488,
      },
      {
        id: "2",
        label: "Regional haul",
        quantity: 1,
        unitPrice: 700,
        total: 700,
      },
    ],
  },
];

export const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "review", label: "Needs review" },
  { value: "ready", label: "Ready" },
] as const;

export function formatCurrency(amount: number, currency: "EUR" | "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function channelLabel(channel: string) {
  return channel === "email"
    ? "Email"
    : channel === "camera"
      ? "Camera scan"
      : "Manual upload";
}

export function statusLabel(status: string) {
  return status === "review"
    ? "Needs review"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export const inboxButtonMeta = {
  icon: Mail,
  label: "Sync inbox",
};
