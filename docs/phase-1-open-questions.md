# Phase-1 Open Questions

1. **Data Storage Strategy:** Do we need a backend database for Phase 1 to save historical quotations, or is it sufficient to generate one-off quotations in the browser (potentially using `localStorage` for temporary draft state)?
2. **Export Mechanism:** Is a clean, branded print-stylesheet sufficient for PDF generation (relying on the browser's native "Print to PDF" dialog), or do we need to implement a dedicated PDF generation library (like `jspdf` or `@react-pdf/renderer`) for stricter layout control?
3. **Tax & Legal Compliance:** What specific taxes (e.g., GST/VAT) and terms & conditions need to be hardcoded into the quotation footer?
4. **Equipment Data Management:** How many items/equipment types will be included? Do we need an administrative UI to add/edit these items, or can they remain static within the code for Phase 1?
5. **Quotation Numbering:** How should quotation ID numbers be generated to avoid duplicates? (e.g., auto-incrementing if a database is used, date-based, or manual input by the user).
