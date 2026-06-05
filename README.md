# Amman Earth Movers – Quotation & Delivery Challan Module

A professional, mobile-first, offline-capable React application designed specifically for Amman Earth Movers to generate, manage, and export high-quality PDF Quotations and Delivery Challans. 

This application replaces traditional manual drafting with a structured, data-driven workflow that guarantees exact visual consistency across all mobile and desktop devices.

## Features

### 1. Quotation Generation Engine
- **Intelligent Pricing Breakdowns:** Automatically calculates base rates, driver charges, fuel, transportation, and custom fees.
- **Automated GST Computation:** Handles CGST, SGST, and auto-round-off to ensure mathematically perfect final grand totals.
- **Customer & Job Profiling:** Captures comprehensive client data, including GST/PAN and exact equipment deployment locations.
- **Customizable Terms:** Editable block for "Terms & Conditions" that neatly aligns with the document layout.

### 2. Delivery Challan Module
- **Dispatch Management:** Independent workflow to manage goods delivery, capturing Transporter, E-Way Bill No, and precise "Bill To" vs "Ship To" addresses.
- **Dynamic Itemization:** Add unlimited items with built-in QTY/Rate calculations while enforcing an un-distorted PDF table structure.

### 3. Professional PDF Export Pipeline
- **Fixed A4 Precision:** Utilizes a rigid 794x1123px hidden template system to render PDFs perfectly. This prevents mobile browsers from expanding tables or scaling fonts.
- **Integrated Signatures:** Automatically dynamically loads the authentic "Authorized Signatory" image natively onto the document.
- **Instant Actions:** Generate, preview, download, and share directly via native OS share sheets on mobile.

### 4. Robust Offline Database
- **IndexedDB Architecture:** Powered by `localforage` for completely disconnected capabilities.
- **Auto-Save Workspaces:** Drafts are stored locally instantly, ensuring no data loss due to accidental refreshes or network drops.
- **Data Isolation:** Quotations and Delivery Challans are managed in completely isolated tables (`quotations` vs `challanStore`).

### 5. Unified Dashboard & History Center
- **Tabbed Archiving:** Easily toggle between Quotations and Challan histories.
- **Advanced Filtering & Sorting:** Search by reference number, client name, or sort by pricing and dates.
- **Lifecycle Management:** Duplicate previous documents, archive old entries, or restore them instantly.

## Tech Stack
- **Frontend Framework:** React 18 with Vite
- **Styling:** CSS3 variables with a mobile-first philosophy
- **Routing:** React Router v6
- **Database:** LocalForage (IndexedDB wrappers)
- **PDF Generation:** `html2canvas` & `jsPDF`
- **Icons:** Lucide React

## Project Structure
```text
src/
├── components/          
│   ├── common/         # Reusable UI components (Input, Card, Button)
│   ├── layout/         # Navigation bars and general layout wrappers
│   └── pdf/            # Strict A4 layout templates for html2canvas
│       ├── QuotationTemplate.jsx
│       ├── ChallanTemplate.jsx
│       └── SignatureBlock.jsx
├── hooks/              # Custom logic for form states and auto-save
│   ├── useQuotationForm.js
│   └── useChallanForm.js
├── pages/              # Application views (Dashboard, Create, Preview, History)
├── services/           # DB interactions and PDF rendering engine
└── styles/             # Global design tokens and resets
```

## Running the Application Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Production Build:**
   ```bash
   npm run build
   ```

## Development & Maintenance Notes
- **Styling:** Do NOT use external CSS frameworks. The project relies on a bespoke `index.css` token system to maintain the precise brand aesthetics of Amman Earth Movers.
- **PDF Constraints:** Any changes made to `src/components/pdf/` must be tested on both Desktop and Mobile browsers, as the PDF generation pipeline requires exact dimensional constraints.
- **Signatures:** The main signature file is located at `public/assets/signature.png`. The system will gracefully fall back to a blank space if this file is missing, but it is required for automatic signing.
