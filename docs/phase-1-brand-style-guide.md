# Amman Earth Movers: Brand Style Guide

This document defines the visual design system for the Quotation Generator application. It ensures a professional, minimal, and highly consistent aesthetic derived strictly from the official company logo (White, Grey, Orange).

---

## 1. Core Color Palette
The application relies on a strict three-color system to maintain an industrial yet premium feel.

- **Brand Orange (Primary/Accent):** `#F39200` (Approximate hex from logo's triangle element).
- **Brand Grey (Structural):** `#6D6E71` (Approximate hex from logo typography).
- **Brand White (Canvas):** `#FFFFFF`.

## 2. Background and Surface Colors
- **Main App Background:** Very light grey (`#F9FAFB`). This subtle tone helps "pop" the active content areas.
- **Content Surfaces (Cards/Forms):** Pure White (`#FFFFFF`). Form sections and the quotation preview pane sit on white cards with very subtle drop shadows.
- **Quotation Canvas (Preview/PDF):** Pure White (`#FFFFFF`), mimicking a crisp A4 sheet of paper.

## 3. Text Colors
- **Primary Text (Headings/Important Data):** Dark Grey (`#333333`) or Brand Grey (`#6D6E71`).
- **Secondary Text (Labels/Helper Text/Placeholders):** Medium Grey (`#888888`).
- **Accent Text (Actionable Links/Totals):** Brand Orange (`#F39200`).
- **Inverse Text (On Orange/Dark Backgrounds):** Pure White (`#FFFFFF`).

## 4. Button Colors
- **Primary CTA (e.g., "Generate PDF", "Create Draft"):** 
  - Background: Brand Orange
  - Text: White
  - Hover: Slightly darker orange (`#E08600`).
- **Secondary/Outline Buttons (e.g., "Cancel", "Back"):** 
  - Background: Transparent
  - Border: Brand Grey
  - Text: Brand Grey
- **Disabled Buttons:** 
  - Background: Light Grey (`#E5E7EB`)
  - Text: Medium Grey (`#9CA3AF`).

## 5. Border and Divider Colors
- **Subtle Dividers (separating list items or table rows):** Very Light Grey (`#E5E7EB`).
- **Form Input Borders (Default):** Light Grey (`#D1D5DB`).
- **Active/Focus Borders:** Brand Orange (`#F39200`) to clearly indicate to the user which field they are currently editing.

## 6. Form Field Styling
- **Shape:** Subtle rounded corners (`4px` to `6px` border-radius) for a modern software feel, avoiding harsh sharp edges.
- **State - Focus:** The border color transitions to Brand Orange, accompanied by a very faint orange outer glow/shadow.
- **State - Error:** The border turns Red (`#EF4444`), with explicit red helper text appearing below the input.
- **Labels:** Labels sit *above* the input fields (vertically stacked) to optimize for narrow mobile screens. They should use small, uppercase, Medium Grey text.

## 7. Header and Footer Styling
- **App Header:** Pure White background (`#FFFFFF`) with a subtle, crisp bottom border (`#E5E7EB`). It anchors the app and houses the logo.
- **Sticky Bottom Action Bar (Mobile):** White background, subtle top shadow. This ensures the primary CTA and live Grand Total are always reachable by the user's thumb without scrolling.

## 8. Logo Usage Rules
- **Aspect Ratio:** The logo must *never* be stretched, squashed, or distorted.
- **Clear Space:** The logo requires visual breathing room. Do not place text or buttons directly abutting the logo. Maintain padding roughly equal to the height of the "A" in AMMAN.
- **Background Contrast:** The logo must only be placed on a Pure White or very light grey background. This is crucial because the "A" triangle icon relies on negative white space to form the letter.
- **App Header Placement:** Top-left corner, horizontally aligned with the navigation title.

## 9. Spacing and Visual Hierarchy Rules
- **Grid System:** Utilize a standard `8px` baseline grid for padding and margins (e.g., `8px`, `16px`, `24px`, `32px`).
- **Whitespace:** Emphasize whitespace to prevent a cluttered dashboard. Form groups (Customer Details vs. Pricing) must be clearly separated by large margins (e.g., `32px`).
- **Hierarchy:** 
  1. `H1` (Page Titles/Grand Totals): Largest, Brand Grey or Orange, Bold.
  2. `H2` (Section Headers): Medium-large, Dark Grey, Semi-bold.
  3. `Body Text` (Inputs, Table Data): Standard readability size (14px-16px), regular weight.

## 10. PDF Quotation Branding Rules
- **Strict Color Adherence:** The generated PDF must completely reject default browser styling. Links and borders must use Brand Grey and Brand Orange.
- **Title Block:** Following the reference image, the title block (e.g., "QUOTATION / RENTAL ESTIMATE") must have a solid Brand Orange background with White text, centered.
- **Section Headers (e.g., "PRICE BREAKDOWN"):** Must have a solid Brand Grey background with White text. This creates strong visual anchors for the client reading the document.
- **Typography:** The PDF should force a clean, geometric sans-serif font (e.g., `Inter`, `Roboto`, or standard `Helvetica/Arial`) across the entire document to match the logo's modern typeface.
