# Phase-1 Master Summary (Handoff to Phase 2)

This document serves as the concise, top-level handoff document summarizing all architectural, logical, and design decisions made during Phase 1. It is the primary reference point for developers beginning Phase 2.

---

## 1. App Goal
To build a fast, mobile-friendly web application that automates the generation of professional, accurately calculated, and consistently branded PDF quotations for Amman Earth Movers. The application must operate entirely offline using in-browser local storage.

## 2. Template-Driven Field List
Derived directly from the physical quotation template, the app manages:
- **Company Header:** Logo, Name, Address, Email, Contact.
- **Customer Details:** Name (Req), Company, Mobile (Req), GST/PAN.
- **Job Details:** Equipment Type (Req), Rental Basis (Req), Location (Req), Required Date (Req).
- **Price Breakdown:** Hire Charges (Req), Driver/Fuel/Transport/Other (Optional), GST % (Optional).
- **Legal:** Configurable Terms & Conditions, Authorized Signatory placeholders.

## 3. Data Schema Summary
Quotations are saved as a structured JSON object encompassing:
- Unique `id`, `quotationRefNo`, and document `status` (Draft vs Finalized).
- Nested objects mapping to the UI: `customerDetails`, `jobDetails`, `pricingBreakdown`, `termsAndConditions`.
- Strict differentiation between user-input fields (e.g., `hireCharges`) and mathematically locked, auto-calculated fields (e.g., `grandTotal`).

## 4. Reference Number Logic
- **Format:** `AEM/[Financial_Year]/[Sequence]` (e.g., `AEM/24-25/0001`).
- **Generation:** Handled via a local state counter. The sequence increments automatically and resets to `0001` every April 1st based on standard Indian accounting rules.
- **Rules:** Deleted drafts "burn" their assigned sequence number to prevent duplicates. Finalized quotes are locked; any further edits require generating a new "Revision" (e.g., `-R1`).

## 5. Local Storage Strategy
- **IndexedDB:** The primary, asynchronous database used to store all quotation records. Provides scalable historical storage and instant indexed searching capability.
- **localStorage:** Used exclusively for tiny, synchronous data such as the reference ID counter and UI theme/company profile settings.
- **No Cloud:** All data remains securely on the device. An "Export to JSON" feature will act as the manual backup and migration mechanism.

## 6. Validation & Calculation Summary
- **Validation Locks:** The "Generate PDF" CTA is disabled until all required fields (Name, Mobile, Equipment, Location, Date, Hire Charges) are filled. Negative price inputs are completely blocked.
- **Calculation Math:** `Subtotal` = Sum of all charges. `GST Amount` = Subtotal * (GST % / 100). `Grand Total` = Subtotal + GST Amount. 
- **Rounding:** All final display values strictly round to two decimal places (e.g., `₹ 14,160.00`).
- **Zero Values:** Optional charges left blank default to 0 and render as `₹ 0.00` (or `-`) on the final PDF to ensure complete transparency.

## 7. Workflow Summary
A mobile-optimized, offline-first user journey:
1. **Launch:** Access app (via QR or link) to a Dashboard listing past quotes.
2. **Draft:** Tap "Create", instantly generating an autosaved draft and reserving an ID.
3. **Input:** Fill a vertically stacked, validated form progressing from Customer Details to Pricing.
4. **Preview:** View a high-fidelity A4 layout preview matching the reference image.
5. **Finalize:** Lock the record and trigger the browser's native Print/PDF dialog.
6. **Manage:** Use the dashboard to instantly search old quotes, or clone them to start a new sequence.

## 8. Branding & Logo Usage Summary
- **Palette Lock:** Strict adherence to Brand Orange (`#F39200`), Brand Grey (`#6D6E71`), and Brand White (`#FFFFFF`). No generic blue links or default styles.
- **Logo Usage:** `amman-logo.png` must be placed top-left in both the app header and the final PDF. It requires adequate padding ("breathing room") and must never have its aspect ratio distorted. It must always sit on a light background.
- **Styling:** The UI will feature modern, slightly rounded inputs that glow Orange on focus, utilizing a clean, professional sans-serif typeface.

## 9. Phase-1 Completion Checklist
- [x] Clear business requirements and goals defined.
- [x] Data schema and local storage architecture finalized.
- [x] Mathematical logic and validation rules locked.
- [x] Visual design system and branding rules documented.
- [x] End-to-end user workflow designed.
- [x] NO CODE WRITTEN YET. 

**STATUS:** **Phase 1 Complete.** The project is officially ready for Phase 2 (React Application Initialization & Development).
