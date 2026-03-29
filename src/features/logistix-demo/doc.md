# Logistix AI – Feature Module Documentation

> Fully interactive mocked UX prototype for logistics invoice management.
> Route: `/demo/logistix`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Map](#file-map)
4. [Type System](#type-system)
5. [State Management](#state-management)
6. [Components](#components)
7. [Mock Data & Constants](#mock-data--constants)
8. [conusai-ui Component Usage](#conusai-ui-component-usage)
9. [Simulation Mechanics](#simulation-mechanics)
10. [Extending the Demo](#extending-the-demo)

---

## Overview

Logistix AI is a self-contained feature module that simulates a finance-operations workspace for logistics companies. It demonstrates every `conusai-ui` layout primitive in a realistic, domain-specific context — invoice upload, AI-powered extraction, manual review, and customer re-invoicing.

**Key capabilities demonstrated:**

- PDF / camera / Gmail intake with staged AI processing simulation
- Invoice list with search, status filtering, and confidence scoring
- Detail inspector panel with editable fields, line-item breakdown, and audit trail
- Re-invoicing workflow with selectable invoices and live margin calculation
- Settings panel with Gmail integration toggle and billing defaults
- Three responsive preview modes (Mobile / Tablet / Desktop)
- Haptic feedback via the Vibration API
- Loader screen with minimum display delay

---

## Architecture

The module follows the same pattern established by `todo-demo`:

```
index.tsx                        ← Entry point: wires state hook into shell
  └─ useLogistixDemoState()      ← Single hook owns ALL state + actions
  └─ LogistixDemoShell            ← Hero section, stat cards, preview selector
       └─ LogistixDemoWorkspace   ← MobilePreviewFrame with full app layout
            ├─ Header
            ├─ LeftSidebar
            ├─ MobileFooter
            ├─ RightSidebar (with ExtractionDetail children)
            └─ Main content area (tab-conditional)
                 ├─ UploadDropzone     (tab: "upload")
                 ├─ InvoiceCard[]      (tab: "invoices")
                 ├─ ReInvoicePreview   (tab: "reinvoice")
                 └─ SettingsForm       (tab: "settings")
```

**Data flow** is strictly top-down. The `LogistixDemoController` type (state + actions union) is threaded from `index.tsx` → shell → workspace → child components. No component manages its own persistent state; all mutations go through the hook's action functions.

---

## File Map

| File | Purpose |
|------|---------|
| `logistix-demo.types.ts` | All TypeScript types for the feature |
| `logistix-demo.constants.ts` | Mock invoice data, nav items, languages, helpers |
| `use-logistix-demo-state.ts` | Central state hook (React 19 patterns) |
| `logistix-demo-shell.tsx` | Hero layout, stat cards, preview mode selector |
| `logistix-demo-workspace.tsx` | App layout inside `MobilePreviewFrame` |
| `index.tsx` | Public entry point, composes hook + shell |
| `components/invoice-card.tsx` | Invoice list card with status badge & confidence meter |
| `components/upload-dropzone.tsx` | Mock upload zone with file/camera/Gmail buttons |
| `components/extraction-detail.tsx` | Invoice detail inspector (Overview / Line Items / Audit tabs) |
| `components/re-invoice-preview.tsx` | Re-invoicing builder with margin calculator |
| `components/settings-form.tsx` | Integration settings and billing defaults |

---

## Type System

All types live in `logistix-demo.types.ts`. Key types:

### Core Domain

```ts
type InvoiceStatus = "new" | "processing" | "review" | "ready";
type InvoiceChannel = "upload" | "camera" | "email";
type InvoiceStatusFilter = "all" | InvoiceStatus;
type LogistixAppTabId = "upload" | "invoices" | "reinvoice" | "settings";
```

### Invoice Model

```ts
type LogisticsInvoice = {
  id: string;
  reference: string;          // e.g. "HAM-RTM-042"
  vendor: string;
  customerName: string;
  route: string;              // e.g. "Hamburg -> Rotterdam"
  amount: number;
  currency: "EUR" | "USD";
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  confidence: number;         // 0–100 AI extraction confidence
  status: InvoiceStatus;
  channel: InvoiceChannel;
  notes: string;
  tags: string[];
  lineItems: InvoiceLineItem[];
};
```

### Upload Queue

```ts
type UploadQueueStatus = "uploading" | "processing" | "complete";

type UploadQueueItem = {
  id: string;
  fileName: string;
  channel: InvoiceChannel;
  progress: number;           // 0–100
  status: UploadQueueStatus;
};
```

### Settings

```ts
type LogistixSettings = {
  gmailConnected: boolean;
  accountantEmail: string;
  templateName: string;
  senderCompany: string;
  replyTo: string;
  defaultMargin: number;      // percentage
};
```

### Controller

```ts
type LogistixDemoController = LogistixDemoState & LogistixDemoActions;
```

This is the single prop type threaded through the entire component tree. It merges all reactive state values with all action functions.

### Summary (derived)

```ts
type LogistixSummary = {
  totalInvoices: number;
  readyCount: number;
  processingCount: number;
  flaggedCount: number;
  totalRecovered: number;
};
```

Computed with `useMemo` from the current invoice list.

---

## State Management

### `useLogistixDemoState()` → `LogistixDemoController`

A single `"use client"` hook in `use-logistix-demo-state.ts` owns every piece of state and every action. This follows the same colocation pattern as `useTodoDemoState()`.

#### Reactive State (16 pieces)

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `language` | `string` | `"en"` | Header language picker value |
| `leftOpen` | `boolean` | `false` | Left sidebar visibility |
| `activeTab` | `LogistixAppTabId` | `"upload"` | Currently active app tab |
| `previewMode` | `PreviewMode` | `"mobile"` | Preview frame size mode |
| `searchQuery` | `string` | `""` | Invoices search input value |
| `statusFilter` | `InvoiceStatusFilter` | `"all"` | Invoice list status filter |
| `invoices` | `LogisticsInvoice[]` | 8 seed invoices | Full invoice collection |
| `selectedInvoiceId` | `string \| null` | `null` | Currently inspected invoice ID |
| `inspectorOpen` | `boolean` | `false` | Right sidebar visibility |
| `uploadQueue` | `UploadQueueItem[]` | `[]` | Live intake queue items |
| `settings` | `LogistixSettings` | `initialSettings` | Current config values |
| `selectedReinvoiceIds` | `string[]` | First 2 ready invoice IDs | Re-invoice selection set |
| `marginPercent` | `number` | `8` (from settings) | Margin calculator percentage |
| `booting` | `boolean` | `true` | Loader screen trigger |

#### Derived Values (5 memoized)

| Value | Source | Description |
|-------|--------|-------------|
| `selectedInvoice` | Lookup by `selectedInvoiceId` | The full invoice object or `null` |
| `visibleInvoices` | `useMemo` over `deferredQuery` + `statusFilter` + `invoices` | Filtered invoice list |
| `summary` | `useMemo` over `invoices` | Aggregated counts and recovered value |
| `isMobilePreview` | Derived from `previewMode` | Boolean shortcut |
| `isDesktopPreview` | Derived from `previewMode` | Boolean shortcut |

#### Actions (16 functions)

| Action | Signature | Behavior |
|--------|-----------|----------|
| `setLanguage` | `(value: string) => void` | Updates language state |
| `setPreviewMode` | `(mode: PreviewMode) => void` | Triggers haptic feedback, wraps in `startTransition` |
| `setSearchQuery` | `(value: string) => void` | Updates search query (deferred via `useDeferredValue`) |
| `setStatusFilter` | `(value: InvoiceStatusFilter) => void` | Updates status filter dropdown |
| `toggleLeftSidebar` | `() => void` | Toggles left sidebar with haptic |
| `closeLeftSidebar` | `() => void` | Closes left sidebar |
| `selectAppTab` | `(id: LogistixAppTabId) => void` | Switches tab, closes sidebar, haptic feedback |
| `openInvoice` | `(id: string) => void` | Selects invoice, opens inspector, switches to invoices tab |
| `closeInspector` | `() => void` | Closes the right sidebar |
| `updateSelectedInvoice` | `(patch: Partial<LogisticsInvoice>) => void` | Immutably patches the selected invoice in state |
| `removeSelectedInvoice` | `() => void` | Removes selected invoice from all collections, closes inspector |
| `simulateUpload` | `(fileName: string, channel: InvoiceChannel) => void` | **Core simulation** – see [Upload Simulation](#upload-simulation) |
| `syncInbox` | `() => void` | **Gmail simulation** – see [Gmail Sync](#gmail-sync) |
| `updateSettings` | `<K>(field: K, value: LogistixSettings[K]) => void` | Type-safe field-level settings update |
| `toggleReinvoice` | `(id: string) => void` | Toggles an invoice in/out of the re-invoice selection |
| `setMarginPercent` | `(value: number) => void` | Updates the margin calculator percentage |

#### React 19 Patterns Used

- **`startTransition`** – wraps tab switches and preview mode changes for non-blocking rendering
- **`useDeferredValue`** – defers the search query to avoid blocking keystroke rendering
- **`useRef`** for mutable sequence counter and timeout tracking (no re-renders)
- **Cleanup via `useEffect`** – clears all queued timeouts on unmount

---

## Components

### `LogistixDemoShell`

**File:** `logistix-demo-shell.tsx`
**Props:** `{ demo: LogistixDemoController }`

The outer page layout. Contains:

- **Badge** – "Logistix AI Mocked UX Prototype" with Truck icon
- **Hero text** – Title, subtitle, and description paragraph
- **Preview mode selector** – 3-button grid (Mobile / Tablet / Desktop) with active state styling
- **Summary stat cards** – 4 `Card` components showing: Invoices tracked, Ready to bill, Needs review, Recovered value
- **`AIExportButton`** – Screenshot generator targeting `project="logistix"`
- **Demo behaviors card** – Explanation of what the interactive actions do
- **`LogistixDemoWorkspace`** – The embedded workspace preview

The grid layout adapts based on `previewMode`: narrow for mobile, wider for tablet, widest for desktop.

### `LogistixDemoWorkspace`

**File:** `logistix-demo-workspace.tsx`
**Props:** `{ demo: LogistixDemoController }`

The full app layout rendered inside `MobilePreviewFrame`. Composes all `conusai-ui` layout primitives:

- **`Loader`** – visible during the boot delay
- **`Header`** – with title derived from active tab, language picker, menu button (mobile only), elevated surface
- **`LeftSidebar`** – overlay on mobile, inline on tablet/desktop, with nav items showing badge counts
- **`RightSidebar`** – overlay on mobile/tablet, inline on desktop, with `ExtractionDetail` as children
- **`MobileFooter`** – 4-tab footer bar (Upload / Invoices / Re-Invoice / Settings)
- **Main content area** – conditionally renders one of four tab panels

The nav items are enriched with `meta` badges showing processing count, total invoices, and reinvoice selection count.

### `InvoiceCard`

**File:** `components/invoice-card.tsx`
**Props:** `{ invoice: LogisticsInvoice; onOpen: (id: string) => void }`

A clickable card showing:

- Reference code and vendor name
- Color-coded status badge with icon (Ready=green, Review=amber, Processing=sky, New=muted)
- Customer name and route
- Amount with currency formatting
- Channel label and due date
- AI confidence progress bar (percentage width, color varies: green ≥90, amber ≥80, red below)
- Tag pills

### `UploadDropzone`

**File:** `components/upload-dropzone.tsx`
**Props:** `{ queue: UploadQueueItem[]; gmailConnected: boolean; onUpload: fn; onSyncInbox: fn }`

Split into two columns (on larger screens):

**Left column – Intake zone:**
- Decorative radial gradient header with Sparkles icon
- "Upload freight PDF" button (triggers `simulateUpload` with `channel: "upload"`)
- "Scan customs receipt" button (triggers `simulateUpload` with `channel: "camera"`)
- "Connect Gmail and import" / "Sync Gmail again" button (toggles based on connection state)

**Right column – Live intake queue:**
- Displays up to 6 most recent `UploadQueueItem` entries
- Each entry shows: file name, channel label, status badge, animated progress bar
- Status colors: complete=green, processing=sky, uploading=muted

### `ExtractionDetail`

**File:** `components/extraction-detail.tsx`
**Props:** `{ invoice: LogisticsInvoice; onChange: (patch: Partial<LogisticsInvoice>) => void }`

Rendered as children of `RightSidebar`. A rich inspector with:

**Header card:**
- Reference, vendor name, extracted total amount
- 3-column stat grid: Confidence %, Status, Route

**Tabbed content (Overview / Line Items / Audit):**

*Overview tab:*
- Editable fields: Vendor, Customer, Invoice number, Status (dropdown), Extraction notes (textarea)
- Issue date and due date display fields
- Tag rendering

*Line Items tab:*
- Iterates over `invoice.lineItems`
- Each line shows: label, quantity × unit price, total

*Audit tab:*
- AI extraction summary (OCR + email parsing + lane memory)
- Document evidence breakdown
- Review controls with "Hold for review" and "Mark ready" action buttons

### `ReInvoicePreview`

**File:** `components/re-invoice-preview.tsx`
**Props:** `{ invoices: LogisticsInvoice[]; selectedIds: string[]; marginPercent: number; onToggle: fn; onMarginChange: fn }`

Split into two columns:

**Left – Invoice selector:**
- Lists all invoices with `status === "ready"`
- Toggle selection with visual highlight (border-primary + bg-primary/8)
- Shows reference, vendor, customer, amount, route

**Right – Re-invoice builder (tabbed: Preview / Totals):**

*Preview tab:*
- Generated invoice preview card
- Lists selected invoices as line items with amounts
- Separator with base total
- Margin input field (editable percentage)
- Grand total (base + margin)
- "Generate & send re-invoice" button (mock action)

*Totals tab:*
- Summary cards: Selected count, Base total, Margin total, Grand total

### `SettingsForm`

**File:** `components/settings-form.tsx`
**Props:** `{ settings: LogistixSettings; onUpdate: fn; onSyncInbox: fn }`

Split into two columns:

**Left – Integrations:**
- Gmail intake card: connection status badge, Connect/Disconnect button, "Import latest emails" button

**Right – Billing defaults:**
- Editable fields: Accountant email, Template name, Default margin %, Sender company, Reply-to address

All fields are controlled inputs that call `onUpdate(field, value)` on change.

---

## Mock Data & Constants

All constants live in `logistix-demo.constants.ts`.

### Languages

```ts
const languages = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "de", label: "German",  flag: "🇩🇪" },
  { value: "pl", label: "Polish",  flag: "🇵🇱" },
];
```

### Footer Tabs / Nav Items

4 tabs mapped to `LogistixAppTabId`: Upload, Invoices, Re-Invoice, Settings. `appNavItems` is derived from `footerTabs`.

### Preview Modes

3 modes: Mobile ("Thumb-first field workflow"), Tablet ("Split review workspace"), Desktop ("Finance operations view").

### Initial Invoices (8 seed records)

| ID | Reference | Vendor | Route | Amount | Status | Channel |
|----|-----------|--------|-------|--------|--------|---------|
| inv-001 | HAM-RTM-042 | Baltic Freight GmbH | Hamburg → Rotterdam | €1,840 | ready | upload |
| inv-002 | GDN-VNO-310 | NordRail Cargo | Gdansk → Vilnius | €1,265 | review | email |
| inv-003 | KLP-RIX-118 | Harbor Customs OU | Klaipeda → Riga | €640 | ready | camera |
| inv-004 | MRS-LYS-227 | TransitFlow SAS | Marseille → Lyon | €2,290 | review | upload |
| inv-005 | LAX-DFW-992 | SkyBridge Cargo | Los Angeles → Dallas | $3,120 | ready | email |
| inv-006 | RTM-PRG-615 | EuroTruck Ops | Rotterdam → Prague | €1,495 | processing | upload |
| inv-007 | ANR-MXP-703 | CargoNet Benelux | Antwerp → Milan | €2,088 | ready | upload |
| inv-008 | VNO-TLL-844 | Mailroom Imports | Vilnius → Tallinn | €905 | new | email |

Each invoice includes realistic line items (e.g., "Container move", "Fuel surcharge", "Port handling") and domain-specific tags.

### Inbox Seed Invoices (2 Gmail templates)

Used by `syncInbox()` to create email-channel invoices:

- Mailroom Imports – Vilnius → Tallinn, €905, "Regional delivery"
- PortLine Agency – Gothenburg → Stockholm, €1,188, "Port service fee" + "Regional haul"

### Status Options

Used in the filter dropdown and status selectors:

```ts
const statusOptions = [
  { value: "all",        label: "All statuses" },
  { value: "new",        label: "New" },
  { value: "processing", label: "Processing" },
  { value: "review",     label: "Needs review" },
  { value: "ready",      label: "Ready" },
];
```

### Helper Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `formatCurrency` | `(amount: number, currency: string) => string` | Formats with `Intl.NumberFormat` (EUR/USD) |
| `channelLabel` | `(channel: InvoiceChannel) => string` | Maps channel to human label ("PDF upload" / "Camera scan" / "Email import") |
| `statusLabel` | `(status: InvoiceStatus) => string` | Maps status to human label ("New" / "Processing" / "Needs review" / "Ready") |

---

## conusai-ui Component Usage

Every `conusai-ui` layout primitive is exercised:

| Component | Where Used | Configuration |
|-----------|------------|---------------|
| `Header` | Workspace | `surface="elevated"`, dynamic title from active tab, language picker with sheet/dropdown switch by preview mode |
| `LeftSidebar` | Workspace | `variant="overlay"` on mobile, `variant="inline"` on tablet/desktop, items with meta badges |
| `RightSidebar` | Workspace | `variant="overlay"` on mobile/tablet, `variant="inline"` on desktop, renders `ExtractionDetail` as children |
| `MobileFooter` | Workspace | 4-tab bar, only rendered in mobile preview mode |
| `MobilePreviewFrame` | Workspace | `mode` prop driven by `previewMode` state |
| `Loader` | Workspace | `visible` driven by `showLoader`, `tone="soft"` |
| `LanguagePicker` | Via Header | 3 languages (EN/DE/PL) with flag emojis |

### shadcn/ui Primitives Used

`Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Textarea`, `Button`, `Separator`

---

## Simulation Mechanics

### Upload Simulation

Triggered by `simulateUpload(fileName, channel)`. Progression:

```
 t=0ms    → Queue item created (progress: 8%, status: "uploading")
           → New invoice added to state (status: "processing")
           → Haptic feedback [10, 24, 10]
           → Tab switches to "upload"

 t=240ms  → Progress updates to 42%

 t=820ms  → Progress updates to 74%, status → "processing"
           → Invoice status → "processing"

 t=1650ms → Invoice settles:
             - confidence = 86 + (seed % 11), range 86–96
             - status = "review" (every 4th) or "ready" (rest)
             - notes updated to match status
           → Queue item → progress: 100%, status: "complete"
```

Each upload generates a unique invoice via `createGeneratedInvoice()` which uses:
- An incrementing sequence counter (`useRef(900)`)
- `crypto.randomUUID()` for IDs
- Template data from the channel or inbox seed

### Gmail Sync

Triggered by `syncInbox()`:

1. Sets `gmailConnected: true` if not already
2. Haptic feedback `[16, 28, 16]`
3. Switches to the "invoices" tab
4. Iterates over `inboxSeedInvoices` (2 entries)
5. For each: creates an invoice + queue item, then schedules `settleInvoice()`
6. Both settle at t=1650ms with the same confidence/status logic as uploads

### Timeout Management

All simulated delays use `queueTimeout()` which wraps `window.setTimeout` and pushes the ID into `timeoutIdsRef`. A cleanup `useEffect` clears all queued timeouts on unmount, preventing memory leaks and state-updates-after-unmount warnings.

---

## Extending the Demo

### Adding a new invoice channel

1. Add the channel string to `InvoiceChannel` in `logistix-demo.types.ts`
2. Add a human label in `channelLabel()` in `logistix-demo.constants.ts`
3. Add a button in `UploadDropzone` with the new channel value
4. The rest of the pipeline handles it automatically

### Adding a new tab

1. Add the tab ID to `LogistixAppTabId`
2. Add an entry to `footerTabs` and it auto-maps to `appNavItems`
3. Add a conditional render block in `LogistixDemoWorkspace`'s main content area
4. Create the tab's component under `components/`

### Adding new seed invoices

Append entries to `initialInvoices` in `logistix-demo.constants.ts`. Each must satisfy the `LogisticsInvoice` type. The summary stats, filter, search, and re-invoice selection all derive reactively.

### Changing the boot loader duration

Adjust the timeout in the first `useEffect` of `useLogistixDemoState()` (currently 120ms). The `useMinimumDelay` hook ensures the loader shows for at least 1000ms regardless.