# Phase-1 Validation and Calculation Rules

This document outlines the strict business logic that the application must enforce to ensure all generated quotations are mathematically accurate, professional, and compliant with Amman Earth Movers' standards.

## 1. Required Field Validation Rules
Before a quotation can be transitioned from "Draft" to "Finalized" (or exported as a PDF), the following fields must be validated:
- **Customer Name:** Required. Must be at least 2 characters long.
- **Mobile No:** Required. Must be a valid numeric format (minimum 10 digits).
- **Vehicle/Equipment Type:** Required. Must not be empty.
- **Rental Basis:** Required. Must be a valid selection (Per Day / Per Hour / Per Trip).
- **Work Location:** Required. Must be at least 2 characters long.
- **Required Date:** Required. Must be a valid date.
- **Vehicle/Equipment Hire Charges:** Required.

## 2. Numeric Validation Rules for Price Inputs
To prevent calculation errors and NaN (Not a Number) crashes:
- All monetary input fields (`hireCharges`, `driverCharges`, `fuelCharges`, `transportCharges`, `otherCharges`, `gstPercentage`) must **only accept numbers and a single decimal point**.
- **Negative values are strictly prohibited.** The UI should reject the `-` keystroke for these fields.
- If an input is cleared, it should default its logical value to `0` for calculation purposes.

## 3. GST Calculation Rule
- **Subtotal Definition:** `SubTotal = hireCharges + driverCharges + fuelCharges + transportCharges + otherCharges`
- **GST Formula:** `gstAmount = SubTotal * (gstPercentage / 100)`
- The system must dynamically recalculate the `gstAmount` instantly whenever any sub-charge or the `gstPercentage` is modified by the user.

## 4. Grand Total Calculation Rule
- **Formula:** `GrandTotal = SubTotal + gstAmount`
- **Constraint:** This field is strictly **read-only / auto-calculated**. The user cannot manually override the Grand Total to prevent mathematical discrepancies on the legal document.

## 5. Rounding Rule
- All internal calculations can use standard JavaScript floating-point precision.
- However, all final display values (on the UI preview and the final PDF) must be strictly rounded to **two decimal places** (e.g., `₹ 14,160.00`).
- Standard "half up" rounding rules apply (e.g., `.5` rounds up to the next cent).

## 6. Behavior of Zero-Value Optional Charges
- Optional charges (`driverCharges`, `fuelCharges`, `transportCharges`, `otherCharges`, `gstPercentage`) default to `0`.
- **UI Behavior:** If an optional charge is `0`, the input field can display `0` or remain blank.
- **Document Rendering:** If an optional charge is exactly `0`, the line item should **still appear** on the final printed quotation with a value of `₹ 0.00` or `-`. This explicitly shows the client that these specific items are included or not being charged extra, ensuring complete transparency and preventing future disputes.

## 7. Handling Missing Required Fields (Draft State)
- If a user leaves a required field empty or invalid, the system simply keeps the document in a "Draft" state.
- The UI will provide real-time feedback, highlighting the missing fields with a red border or an inline warning icon.

## 8. Preventing Invalid Quotation Generation
- The primary "Generate PDF" or "Finalize Quotation" Call-to-Action (CTA) button must remain **disabled** until all required field validation rules pass.
- If a user attempts to bypass this (e.g., hitting a keyboard shortcut), the system must block the transition and present a global error toast/modal listing exactly which requirements are missing.

## 9. Branding Field Validation (Logo Fallback)
- **Company Name:** The settings must always enforce a non-empty `companyName`.
- **Logo Rule:** The system expects the primary logo at `assets/amman-logo.png`.
- **Fallback Behavior:** If the logo image fails to load (e.g., file deleted or path error), the application must gracefully fall back to displaying the `companyName` as a stylized, bold text header using the brand's Orange and Grey colors. The final document must **never** render a broken image icon.

## 10. Standardized Validation Error Messages
These exact strings will be used in the UI to guide the user:
- `ERR_REQ_NAME`: "Customer Name is required."
- `ERR_INV_MOBILE`: "Please enter a valid 10-digit mobile number."
- `ERR_REQ_EQP`: "Please specify the vehicle or equipment type."
- `ERR_REQ_LOC`: "Work location cannot be empty."
- `ERR_REQ_DATE`: "Please select a required date."
- `ERR_INV_AMT`: "Amount cannot be negative."
- `ERR_MISSING_HIRE`: "Base hire charges must be entered."
