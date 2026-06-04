import { createEmptyQuotation } from '../models/quotation';
import { getAllQuotations } from './quotationService';

/**
 * Validates and repairs corrupted quotation data.
 * Merges missing nested objects (e.g. from older backups) with the latest schema to prevent UI crashes.
 */
export const repairQuotationSchema = (quote) => {
  if (!quote) return null;
  const template = createEmptyQuotation();
  
  return {
    ...template,
    ...quote,
    customerDetails: { ...template.customerDetails, ...quote.customerDetails },
    jobDetails: { ...template.jobDetails, ...quote.jobDetails },
    pricingBreakdown: { ...template.pricingBreakdown, ...quote.pricingBreakdown },
    termsAndConditions: { ...template.termsAndConditions, ...quote.termsAndConditions },
    brandingMetadata: { ...template.brandingMetadata, ...quote.brandingMetadata }
  };
};

/**
 * Detects if a very similar quotation was created recently to prevent double-entry errors.
 * Checks for: Same Customer, Same Equipment, Created on the same day, Same Amount.
 */
export const detectDuplicate = async (newQuote) => {
  if (!newQuote.customerDetails?.customerName) return false;
  
  const allQuotes = await getAllQuotations();
  const newDate = new Date(newQuote.createdAt).toDateString();
  
  return allQuotes.some(q => {
    // Ignore self (when editing)
    if (q.id === newQuote.id) return false;
    
    const isSameCustomer = q.customerDetails?.customerName?.toLowerCase() === newQuote.customerDetails.customerName.toLowerCase();
    const isSameEquipment = q.jobDetails?.equipmentType === newQuote.jobDetails?.equipmentType;
    const isSameDate = new Date(q.createdAt).toDateString() === newDate;
    const isSameAmount = q.pricingBreakdown?.grandTotal === newQuote.pricingBreakdown?.grandTotal;
    
    return isSameCustomer && isSameEquipment && isSameDate && isSameAmount;
  });
};

/**
 * Recovers interrupted or orphaned drafts from localStorage.
 * Useful if the browser crashes before a manual save or autosave completes.
 */
export const recoverOrphanedDrafts = () => {
  const orphans = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('aem_wip_draft') || key.startsWith('aem_edit_draft_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        // Only return if it actually has meaningful data entered
        if (data && data.customerDetails?.customerName) {
          orphans.push({ key, data });
        }
      } catch (e) {
        console.error("Failed to parse orphaned draft", e);
      }
    }
  }
  return orphans;
};
