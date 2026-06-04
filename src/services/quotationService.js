import { quotationStore } from './db';
import { repairQuotationSchema } from './dataIntegrityService';

/**
 * Creates or updates a quotation in IndexedDB.
 */
export const saveQuotation = async (quotation) => {
  try {
    quotation.updatedAt = new Date().toISOString();
    await quotationStore.setItem(quotation.id, quotation);
    return quotation;
  } catch (error) {
    console.error('Error saving quotation:', error);
    throw error;
  }
};

/**
 * Fetches a single quotation by its UUID.
 */
export const getQuotationById = async (id) => {
  try {
    const data = await quotationStore.getItem(id);
    return repairQuotationSchema(data);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

/**
 * Fetches all quotations, optionally filtered by status ('draft' or 'finalized').
 * Returns an array sorted descending by creation date.
 */
export const getAllQuotations = async (statusFilter = null) => {
  try {
    const quotations = [];
    await quotationStore.iterate((value) => {
      if (!statusFilter || value.status === statusFilter) {
        quotations.push(repairQuotationSchema(value));
      }
    });
    // Sort newest first
    return quotations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching all quotations:', error);
    throw error;
  }
};

/**
 * Basic in-memory search function for the History page.
 * Searches across customer name and reference number.
 */
export const searchQuotations = async (query) => {
  try {
    const lowerQuery = query.toLowerCase();
    const quotations = [];
    await quotationStore.iterate((value) => {
      const matchName = value.customerDetails?.customerName?.toLowerCase().includes(lowerQuery);
      const matchRef = value.quotationRefNo?.toLowerCase().includes(lowerQuery);
      if (matchName || matchRef) {
        quotations.push(repairQuotationSchema(value));
      }
    });
    // Sort newest first
    return quotations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error searching quotations:', error);
    throw error;
  }
};

/**
 * Deletes a quotation from the database entirely.
 * Should generally only be exposed for 'draft' records to preserve audit trails.
 */
export const deleteQuotation = async (id) => {
  try {
    await quotationStore.removeItem(id);
    return true;
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw error;
  }
};
