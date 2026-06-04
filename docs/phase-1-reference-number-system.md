# Quotation Reference Number System

This document outlines the strategy for generating, managing, and tracking quotation reference numbers within the local-only environment of the Amman Earth Movers application.

## 1. Evaluation of Reference Number Formats

Here are 3 example formats considered for the application:

**Format 1: Sequential Basic (e.g., `AEM-00125`)**
- *Structure:* Prefix + 5-digit sequential number.
- *Pros:* Extremely simple to read and communicate.
- *Cons:* Does not provide context about the date/year. Numbers grow very large over time, making it hard to track annual volume at a glance.

**Format 2: Date + Random Alphanumeric (e.g., `AEM-2410-A9F2`)**
- *Structure:* Prefix + YearMonth + 4 random alphanumeric characters.
- *Pros:* Almost guarantees no duplicates without needing a strict stateful counter.
- *Cons:* Looks unprofessional for formal business documents. Hard to dictate over the phone or type manually.

**Format 3: Financial Year + Sequential (e.g., `AEM/24-25/0125`)**
- *Structure:* Prefix + Financial Year + 4-digit sequential number resetting each year.
- *Pros:* Highly professional, standard practice in accounting, immediately indicates the year of issue, and resets annually keeping numbers short and manageable.
- *Cons:* Requires logic to determine the current financial year and reset the counter on April 1st.

**Recommendation:** **Format 3 (`AEM/24-25/0125`) is the best choice.** It aligns with professional accounting standards, makes historical sorting easy, and prevents the sequence from growing infinitely long, presenting a highly professional image to Amman Earth Movers' clients.

---

## 2. Recommended Reference Number Format

**Structure:** `[PREFIX]/[FINANCIAL_YEAR]/[SEQUENCE]`
**Example:** `AEM/24-25/0001`

- **Prefix:** `AEM` (Amman Earth Movers).
- **Financial Year:** (e.g., `24-25`). Derived from the Indian financial year standard (April 1st to March 31st). 
- **Sequence:** A 4-digit number (e.g., `0001`) padded with leading zeros, which increments for each new quotation.

## 3. Logic for Generating the Next Number

Since this is a local-only application (running entirely in the browser without a backend), the generation logic relies on a state counter in `localStorage`.

1. **Determine Current FY:** The app checks today's date. If the month is April (month index 3) or later, the FY is `CurrentYear - NextYear`. If January to March, the FY is `PreviousYear - CurrentYear`.
2. **Read Counter State:** Retrieve a dedicated `quotationCounter` object from local storage (e.g., `{ currentFY: "24-25", lastSequence: 125 }`).
3. **Compare & Calculate:**
   - If the current FY **matches** `counter.currentFY`: increment `lastSequence` by 1.
   - If the current FY **does not match** (meaning a new financial year has started): reset `lastSequence` to `1` and update `currentFY`.
4. **Construct & Save:** Pad the new sequence with zeros (e.g., `0126`), construct the string `AEM/24-25/0126`, and **immediately** save the updated counter back to local storage to "reserve" the number before the user even saves the draft.

## 4. Rule for Handling Duplicate or Deleted Quotations

- **Strict Incrementing (No Re-use):** The sequence counter *never* goes backwards. If quotation `AEM/24-25/0015` is deleted by the user or abandoned as a draft, that number is "burned" and permanently retired. The next generated quotation will still be `AEM/24-25/0016`.
- **Rationale:** This prevents race conditions, prevents accidental overwrites, ensures audit traceability, and guarantees absolute uniqueness within the local storage database.

## 5. Rule for Editing Finalized Quotations

- **Drafts:** Quotations in "draft" status hold their assigned reference number and can be edited freely.
- **Finalized:** Once marked "finalized" (e.g., exported as a PDF to send to a client), the record should be locked to preserve historical accuracy.
- **Revisions:** If a client requests changes *after* a quotation is finalized, the system should allow creating a **Revision**. 
  - Instead of overwriting the original document, it creates a new record using a revision suffix: `AEM/24-25/0015-R1`. 
  - The base reference number does not change, maintaining a clear paper trail of negotiations.

## 6. Rule for Duplicate / Clone Quotation Creation

- **Action:** A user clicks "Clone" on an existing quotation (e.g., to quote the exact same equipment list to a brand new client).
- **Behavior:** The cloned quotation is treated as a completely **new** entity. It receives the **next available** sequence number in the current financial year (e.g., `AEM/24-25/0127`). It does NOT inherit the original reference number.

## 7. Search and Tracking Strategy

Because data is local, search is performed in-memory, requiring efficient strategies.
- **Primary Text Search:** An input field that performs an exact or partial string match against the `quotationRefNo`. Typing "0125" will instantly filter the UI list down to `AEM/24-25/0125`.
- **Categorical Filtering:** A dropdown to filter by Financial Year. Because the FY is encoded directly in the string (the middle segment), the UI can easily extract and group records by year without parsing dates.
- **Sorting:** Format 3 naturally sorts chronologically if standard alphabetical string sorting is applied (e.g., `AEM/24-25/0001` comes before `AEM/24-25/0002`), making standard array sorting highly efficient and fast on the device.
