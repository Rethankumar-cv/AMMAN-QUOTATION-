# Phase-1 Field Inventory

This document outlines all fields required for the Amman Earth Movers Quotation Generator, based on the provided source-of-truth quotation template.

## 1. Company Header Fields
*These fields represent the company issuing the quotation. In Phase 1, these can be hardcoded or managed in a static configuration file.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `companyName` | Company Name | Text | Yes | Pre-filled (Config) | None | No (Settings only) |
| `companyTagline`| Tagline | Text | Yes | Pre-filled (Config) | None | No (Settings only) |
| `companyAddress`| Address | Text | Yes | Pre-filled (Config) | None | No (Settings only) |
| `companyEmail` | E-mail | Email | Yes | Pre-filled (Config) | Valid Email Format | No (Settings only) |
| `companyContact`| Contact | Text | Yes | Pre-filled (Config) | None | No (Settings only) |

## 2. Customer Details
*Information about the client receiving the quotation.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `customerName` | Customer Name | Text | Yes | User-entered | Min 2 characters | Yes |
| `customerCompany`| Company Name | Text | No | User-entered | None | Yes |
| `customerMobile` | Mobile No. | Tel | Yes | User-entered | Valid phone format | Yes |
| `customerGstPan` | GST / PAN | Text | No | User-entered | Alphanumeric | Yes |

## 3. Job / Rental Details
*Details regarding the equipment and the nature of the rental.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `equipmentType` | Vehicle / Equipment | Select/Text| Yes | User-entered | Must be selected | Yes |
| `rentalBasis` | Rental Basis | Select | Yes | User-entered | Per Day/Hour/Trip | Yes |
| `workLocation` | Work Location | Text | Yes | User-entered | Min 2 characters | Yes |
| `requiredDate` | Required Date | Date | Yes | User-entered | Valid Date | Yes |

## 4. Price Breakdown
*Cost components for the quotation.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hireCharges` | Vehicle/Eqp Hire Charges| Number | Yes | User-entered | >= 0 | Yes |
| `driverCharges` | Driver Charges | Number | No | User-entered | >= 0 (Default 0)| Yes |
| `fuelCharges` | Fuel Charges | Number | No | User-entered | >= 0 (Default 0)| Yes |
| `transportCharges`| Transportation / Mob. | Number | No | User-entered | >= 0 (Default 0)| Yes |
| `otherCharges` | Other Charges | Number | No | User-entered | >= 0 (Default 0)| Yes |
| `gstAmount` | GST | Number | No | User-entered | >= 0 | Yes |
| `grandTotal` | GRAND TOTAL | Number | Yes | Auto-generated | Sum of above | No (Calculated) |

## 5. Terms and Conditions
*Standard terms applied to the quotation.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `keyTerms` | Key Terms | Textarea | Yes | Pre-filled (Config) | None | Yes (Overrideable) |

**Default Terms to include:**
1. Rate is subject to vehicle availability and work-site conditions.
2. GST will be charged extra as applicable.
3. Working hours, fuel, and driver charges are as agreed for each vehicle.
4. This quotation is valid for 5 days from the date of issue.
5. Interest at 18% will be charged if payment is not made within 30 days from the date of the bill.

## 6. Approval / Signatory Section
*Visual placeholders for the document.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `signatoryName` | Authorized Signatory | Text | No | Pre-filled (Config) | None | No (Settings only) |
| `sealPlaceholder`| Company Seal / Stamp | Image/Box | Yes | Pre-filled (Config) | None | No |

## 7. System-Generated Fields
*Fields managed by the application logic.*

| Field Name | Label Shown in UI | Input Type | Required | Entered / Auto | Validation Rules | Editable After Save |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `quotationRefNo` | Ref No | Text | Yes | Auto-generated | Format: QTN-XXX | No |
| `quotationDate` | Date | Date | Yes | Auto-generated | Current Date | Yes (Allow backdate)|
| `customerToHeader`| Customer / To | Text | Yes | Auto-generated | Combine Name/Comp| No |

## 8. Brand / Logo-Related Display Fields

**Logo Placement Rules:**
1. **App Header:** The logo should be placed in the top-left corner of the main application navigation bar. It acts as a brand anchor and home button for the internal user.
2. **Quotation Preview:** In the live preview pane, the logo must be positioned at the top-left of the document, matching the provided template structure. It should sit opposite to the Company Name and address block.
3. **Final PDF Output:** The final PDF or printed document must replicate the preview exactly. The logo must appear in the top-left corner, rendered at a high resolution with the correct aspect ratio, maintaining the professional white, grey, and orange branding.
