# Phase-1 Data Schema

This document defines the structured JSON data model for a quotation record. This schema is designed to be easily serialized and stored locally on the user's device (e.g., using `localStorage` or `IndexedDB`).

## Core Schema Definition

### 1. Root Level Fields
| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Yes | Yes | Unique identifier (UUID). |
| `quotationRefNo` | String | Yes | Yes | Human-readable reference number (e.g., "QTN-001"). |
| `status` | String | Yes | No | Current state of the document (`"draft"`, `"finalized"`, `"void"`). |
| `createdAt` | Date(ISO) | Yes | Yes | Timestamp of creation. |
| `updatedAt` | Date(ISO) | Yes | Yes | Timestamp of last modification. |

### 2. Customer Details (`customerDetails` object)
| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `customerName` | String | Yes | No | Name of the contact person. |
| `companyName` | String | No | No | Client's company name. |
| `mobileNo` | String | Yes | No | Contact phone number. |
| `gstPan` | String | No | No | GST or PAN number for tax purposes. |

### 3. Job / Rental Details (`jobDetails` object)
| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `equipmentType`| String | Yes | No | Type of vehicle/equipment being rented. |
| `rentalBasis` | String | Yes | No | The unit of rental (`"Per Day"`, `"Per Hour"`, `"Per Trip"`). |
| `workLocation` | String | Yes | No | Site location for the work. |
| `requiredDate` | Date(ISO) | Yes | No | Date the equipment is required on-site. |

### 4. Pricing Breakdown (`pricingBreakdown` object)
*Note: All monetary values should be stored as numbers (floats or integers representing cents, but for phase 1 floats are acceptable).*

| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `hireCharges` | Number | Yes | No | Base rental cost. |
| `driverCharges`| Number | No | No | Cost for driver/operator (defaults to 0). |
| `fuelCharges` | Number | No | No | Cost for fuel (defaults to 0). |
| `transportCharges`|Number | No | No | Cost for mobilization/transport (defaults to 0). |
| `otherCharges` | Number | No | No | Any miscellaneous charges (defaults to 0). |
| `gstPercentage`| Number | No | No | GST rate applied (e.g., 18). |
| `gstAmount` | Number | No | Yes (usually)| The calculated monetary amount of GST. |
| `subTotal` | Number | Yes | Yes | Sum of all charges *before* GST. |
| `grandTotal` | Number | Yes | Yes | Sum of `subTotal` + `gstAmount`. |

### 5. Terms and Conditions (`termsAndConditions` object)
| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `keyTerms` | Array[String]| Yes | No (Config)| Array of strings representing bullet points. |

### 6. Branding / System Metadata (`brandingMetadata` object)
| Field Name | Type | Mandatory? | Auto-Calculated? | Description |
| :--- | :--- | :--- | :--- | :--- |
| `companyName` | String | Yes | Yes | Hardcoded to "AMMAN EARTH MOVERS". |
| `logoUrl` | String | Yes | Yes | Local path/URI to the brand logo. |
| `contactInfo` | String | Yes | Yes | Hardcoded contact info for the footer/header. |
