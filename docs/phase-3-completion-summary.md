# Phase 3 Completion Summary - Amman Earth Movers Quotation App

## 1. Logic Implementation Overview
Phase 3 focused entirely on bridging the static Phase 2 UI with a robust, offline-first React state management engine and an IndexedDB persistence layer. The app now fully supports the complete quotation lifecycle—from blank draft to finalized, locked record—without requiring any cloud backend or network connection.

## 2. Quotation Form Structure
The main quotation form (`CreateQuotation.jsx`) is powered by a custom React hook (`useQuotationForm`). 
- It divides the data into logical sections: `customerDetails`, `jobDetails`, `pricingBreakdown`, and `termsAndConditions`.
- The form intelligently detects if it is in "New" or "Edit" mode via URL parameters (`/edit/:id`).
- If a quotation is marked as `finalized`, the form automatically locks all inputs (`pointer-events: none`, `opacity: 0.7`) to prevent post-finalization accounting tampering.

## 3. Pricing Calculation Engine
The pricing engine (`src/utils/calculations.js`) operates in real-time as the user types:
- **Math Safety:** A strict `parseNumber` utility ensures empty fields or invalid characters are safely treated as `0`, preventing application crashes (NaN errors).
- **GST Flexibility:** Users can toggle GST Calculation between `% Percentage` (auto-calculated) and `₹ Fixed Amount` (manual override).
- **Rounding:** The grand total automatically rounds to the nearest Rupee to align with standard Indian accounting practices.

## 4. Validation Rules
The form enforces data integrity on two levels:
- **On-Blur (Inline):** When a user taps out of a field, specific rules are checked (e.g., Mobile must be exactly 10 digits, GST must be 15 chars, numbers cannot be negative). Inline red text appears under the specific field if it fails.
- **On-Submit (Gatekeeper):** Clicking "Review & Finalize" triggers a full-form sweep. If errors exist, a warning banner appears at the top of the form, preventing document generation.

## 5. Draft Autosave Mechanism
To protect against data loss in the field (e.g. app refreshed, tab closed, device sleep):
- **Debounced Autosaving:** The `useQuotationForm` hook silently saves the exact state of the form to `localStorage` 1 second after the user stops typing.
- **Draft Isolation:** Editing an existing quotation saves to a unique key (`aem_edit_draft_[ID]`), ensuring it does not overwrite a generic "New Quotation" draft (`aem_wip_draft`).
- **Restoration:** If the app is closed or refreshed, the hook automatically restores the draft from memory on mount.

## 6. Reference Number Generation
The Sequence Generator (`src/utils/referenceGenerator.js`) guarantees unique accounting IDs:
- **Format:** `AEM/YY-YY/XXXX` (e.g., `AEM/24-25/0042`).
- **Financial Year Logic:** Automatically reads the system clock to determine the correct Indian Financial Year (handling the April 1st rollover).
- **Burn Prevention:** The sequence number is only requested and "locked in" the exact moment the user clicks "Review & Finalize" and passes validation. This prevents wasted sequence numbers on abandoned drafts.

## 7. Quotation History Connection
The `QuotationHistory.jsx` view is powered by the `useQuotationHistory` hook, connecting directly to the IndexedDB layer via `quotationService.js`.
- **Live Feed:** Pulls all saved quotations asynchronously on mount.
- **In-Memory Search:** A `useMemo` filter allows instant, zero-lag searching by name, company, or reference number.
- **Action Flow:** Supports routing to the Editor (Drafts), Document Viewer (Finalized), permanent Deletion (with browser confirmation), and instantaneous Duplication (Cloning).

## 8. What Remains for Phase 4 (Final Phase)
Phase 4 will focus exclusively on Exporting & Sharing the finalized data:
- **PDF Generation:** Implementing libraries (e.g., `jspdf` and `html2canvas`) to convert the exact A4 DOM structure in `Preview.jsx` into a high-quality downloadable PDF.
- **Native Sharing:** Wiring up the Web Share API to allow managers to instantly send the generated PDF via WhatsApp or Email directly from their mobile browser.
- **Final Polish:** Removing any remaining placeholder elements, verifying iOS/Android touch quirks, and confirming the PWA manifest is ready for home-screen installation.
