# Phase-1 Local Storage Strategy

Since the Amman Earth Movers Quotation Generator must operate entirely on the local device without cloud storage, a robust in-browser storage strategy is critical for preserving history, supporting search, and maintaining user settings.

## 1. Evaluation of Local Storage Options

| Storage Type | Characteristics | Verdict for this App |
| :--- | :--- | :--- |
| **`sessionStorage`** | Data is cleared when the page session ends (tab is closed). Capacity is ~5MB. | **Rejected.** Unsuitable for preserving historical quotation data or persistent settings. |
| **`localStorage`** | Data persists across sessions. Simple key-value string pairs. Synchronous API (blocks main thread). Capacity is ~5MB. | **Partial Use.** Good for tiny, frequently accessed data like the reference number counter or UI settings. Not ideal for hundreds of quotation records due to size limits and lack of search indexing. |
| **`IndexedDB`** | Data persists across sessions. Stores complex objects directly. Asynchronous API. Very large storage capacity (GBs depending on disk space). Built-in indexing for fast queries. | **Recommended (Primary Store).** The absolute best choice for storing the database of drafted and finalized quotations, allowing for efficient querying, historical lookups, and scalability over years of use. |

**Strategy Decision:** 
We will use **IndexedDB** (potentially abstracted via a lightweight wrapper like `idb` or `localforage`) for the primary database of quotations, and **`localStorage`** exclusively for the reference number sequence counter and light UI configuration.

---

## 2. What Data Should Be Stored Locally

All application data will live in the browser. This includes:
- The running sequence counter for reference numbers.
- Global application settings and branding references.
- All quotation documents (Drafts, Finalized, Revisions).

## 3. Draft Quotation Data
- **Behavior:** Autosaved continuously as the user types. 
- **Storage:** Saved in IndexedDB under a `quotations` object store with `status: 'draft'`.
- **Content:** The incomplete JSON schema (from `phase-1-data-schema.md`). Drafts are mutable and their reference numbers are reserved but not locked.

## 4. Finalized Quotation Data
- **Behavior:** Locked upon generation of the final PDF.
- **Storage:** Saved in the same IndexedDB `quotations` object store but marked with `status: 'finalized'`.
- **Content:** The complete JSON schema. Once finalized, the UI should prevent direct editing of this record to preserve the audit trail (requiring a "Revision" or "Clone" instead).

## 5. Configuration and Settings Data
- **Storage:** Saved in `localStorage` for immediate, synchronous access on app boot.
- **Content:**
  - `quotationCounter`: `{ currentFY: "24-25", lastSequence: 42 }`
  - `companyProfile`: Company name, address, contact numbers, tax numbers.
  - `brandingSettings`: Path to the local logo (`assets/amman-logo.png`), default color tokens if the user wants to tweak the grey/orange slightly.
  - `defaultTerms`: The default list of terms and conditions to pre-populate on new quotes.

## 6. Search and Indexing Strategy
To ensure the app remains blazing fast even after creating thousands of quotations:
- The IndexedDB `quotations` store will have explicit **Indexes** created on:
  - `quotationRefNo` (Unique Index - for direct lookups).
  - `status` (For filtering drafts vs finalized).
  - `customerDetails.customerName` (For searching by client).
  - `createdAt` (For sorting chronologically).
- **Search Execution:** When a user types in the search bar, the app will utilize an IndexedDB cursor to quickly fetch records matching the `customerName` or `quotationRefNo` indexes without needing to load the entire database into memory.

## 7. Backup and Export Strategy (No Cloud)
Because data lives only in the user's browser, clearing browser site data will permanently delete all quotations. To mitigate this risk without a cloud backend:
- **JSON Export:** A "Backup Data" button in the Settings panel will fetch all records from IndexedDB and serialize them into a single massive JSON file (`amman-quotes-backup-2024-10-27.json`). The browser will trigger a native download to the user's hard drive.
- **JSON Import:** A "Restore Data" button will allow the user to upload that JSON file back into the app, parsing it and repopulating the IndexedDB store. This allows data to be safely migrated between computers (e.g., from an office desktop to a laptop) via a USB drive.
