# Phase-1 Workflow: Amman Earth Movers

This document outlines the end-to-end user journey for generating, managing, and duplicating quotations. The workflow is explicitly optimized for mobile devices (e.g., accessed via a QR code or bookmark by site managers in the field) and ensures the brand identity remains consistent at every touchpoint.

---

## 1. App Launch & Dashboard
- **User Action:** User scans a QR code or opens the app URL on their mobile browser.
- **System Action:**
  - Loads the web application instantly (offline capable).
  - Displays a persistent, sticky top header featuring the Amman Earth Movers logo and brand colors (White/Grey/Orange).
  - Initializes `localStorage` and `IndexedDB`.
  - Displays the "Dashboard," showing a search bar and a chronologically sorted list of recent quotations.
- **Validation Points:** System verifies that `IndexedDB` is supported and accessible by the browser.
- **Saved Data State:** Reads existing data; no new data is written.
- **Cancel/Back Navigation:** N/A (Root level).

## 2. Creating a New Quotation (Initialization)
- **User Action:** Taps a prominent, Orange "Create New Quotation" Floating Action Button (FAB).
- **System Action:**
  - Generates the next sequential `quotationRefNo` based on the Financial Year logic.
  - Creates a new JSON object in memory with `status: 'draft'`.
  - Opens the "Create Quotation" wizard (Step 1: Customer & Job Details).
- **Validation Points:** Ensures the newly generated ID does not conflict with any existing records.
- **Saved Data State:** The new draft is immediately pushed to `IndexedDB` to safely reserve the reference number.
- **Cancel/Back Navigation:** Tapping "Back" prompts: "Save as Draft or Discard?". 
  - *Discarding* deletes the draft entirely and "burns" the ID. 
  - *Saving* keeps it in the Dashboard marked with a gray "Draft" badge.

## 3. Entering Customer & Job Details
- **User Action:** Fills out Customer Name, Mobile, Equipment Type, Location, and Date using a vertically stacked, mobile-friendly form.
- **System Action:**
  - Auto-saves input data to the draft object in real-time as the user types.
  - Displays inline validation ticks (green) or error messages (red, e.g., `ERR_REQ_NAME`).
- **Validation Points:** 
  - Name (min 2 chars).
  - Mobile (min 10 digits).
  - Equipment/Location/Date cannot be empty.
- **Saved Data State:** `IndexedDB` draft record is updated continuously.
- **Cancel/Back Navigation:** Form data is inherently preserved in the draft. Returning to the Dashboard keeps the draft available for later editing.

## 4. Entering Pricing Details
- **User Action:** Taps "Next: Pricing". Enters Base Hire Charges, and optionally inputs Driver, Fuel, Transport, and GST percentage.
- **System Action:**
  - Performs real-time calculation of the Subtotal, GST Amount, and Grand Total.
  - Updates a sticky bottom summary bar showing the live `Grand Total: ₹ XX.XX`.
- **Validation Points:** Rejects negative numbers and non-numeric keystrokes instantly.
- **Saved Data State:** `IndexedDB` draft is updated with the pricing breakdown and calculated totals.
- **Cancel/Back Navigation:** Tapping "Back" returns the user to the Customer Details step without losing any pricing data.

## 5. Previewing the Quotation
- **User Action:** Taps "Review & Finalize".
- **System Action:**
  - Checks all required fields across both previous steps.
  - If valid, renders a high-fidelity document layout matching the physical A4 template.
  - Displays the company logo in the top-left, applying strict Orange/Grey brand colors to the table headers, terms, and totals.
- **Validation Points:** A global validation check occurs here. If any required fields are missing, the system blocks navigation and highlights the specific missing fields.
- **Saved Data State:** `status` remains `'draft'`.
- **Cancel/Back Navigation:** Tapping an "Edit" button returns the user to the form steps to adjust values.

## 6. Confirming & Generating PDF (Finalization)
- **User Action:** Taps the final "Generate PDF" button on the preview screen.
- **System Action:**
  - Locks the quotation (changes `status` to `'finalized'`).
  - Triggers the browser's native Print/PDF dialog, formatted strictly for A4 printing.
  - Upon closing the dialog, redirects the user back to the Dashboard displaying a success toast.
- **Validation Points:** Final safety check to ensure mathematical accuracy before locking.
- **Saved Data State:** `IndexedDB` record is updated to `status: 'finalized'`.
- **Cancel/Back Navigation:** Once finalized, the standard "Back" action is disabled for the wizard; the user must return to the Dashboard.

## 7. Searching Old Quotations
- **User Action:** User taps the search bar on the Dashboard and types a name (e.g., "Ramesh") or an ID (e.g., "0125").
- **System Action:**
  - Queries `IndexedDB` indexes (`customerName` or `quotationRefNo`).
  - Instantly filters the list below.
- **Validation Points:** N/A.
- **Saved Data State:** Read-only operation.
- **Cancel/Back Navigation:** Clearing the search bar restores the full chronological list.

## 8. Reopening or Duplicating an Old Quotation
- **User Action:** Taps a finalized quotation from the dashboard list.
- **System Action:**
  - Opens the "Preview" view in strict **Read-Only mode**.
  - Displays secondary action buttons: "Print/Download PDF" and "Duplicate/Clone".
- **Validation Points:** System ensures no edit inputs are exposed for finalized records.
- **Saved Data State:** Read-only state.
- **Clone Action:** 
  - If the user taps "Duplicate", the system extracts the `customerDetails`, `jobDetails`, and `pricingBreakdown`.
  - It generates a **brand new** `quotationRefNo` (e.g., `AEM/24-25/0126`).
  - Opens the "Create Quotation" wizard pre-filled with this data as a brand new Draft.
  - The new Draft is saved to `IndexedDB`, safely separated from the original record.
