# Phase-1 Assumptions and Risks

## Assumptions
- The application will initially be used by internal staff only (no customer-facing self-service portal is required for Phase 1).
- Standardized rates and equipment lists exist and can be hardcoded or managed via a simple configuration file initially.
- The application will be accessed via modern desktop web browsers (Chrome, Edge, Safari). Mobile responsiveness is a secondary priority for Phase 1 if the primary use case is desktop office work.
- The primary output format required is a standard A4 printable layout that can be easily saved as a PDF via the browser.

## Risks
- **Scope Creep:** Additional features like full CRM integration, invoicing, or payment tracking might be requested early, which could delay the core quotation functionality.
- **Complex Pricing Models:** If pricing rules (e.g., dynamic taxes, varied transport fees, tiered volume discounts) are too complex, the calculation engine might become difficult to implement within the initial timeframe.
- **Data Persistence:** If local storage is solely used for Phase 1 without a backend database, drafted quotations could be lost if the user clears their browser cache.
- **Print/PDF Inconsistencies:** Ensuring the generated quotation looks pixel-perfect across different browsers and print-to-PDF drivers can sometimes be challenging due to differing browser renderers.
