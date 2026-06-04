import { getAllQuotations, saveQuotation } from './quotationService';
import { getSettings, saveSettings } from './settingsService';

/**
 * BACKUP SERVICE
 * Extracts all local data (IndexedDB quotations + LocalStorage settings) 
 * into a single portable JSON payload.
 */
const getAppLocalStorageData = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Only extract keys specific to our application
    if (key.startsWith('aem_settings_')) {
      data[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  return data;
};

export const createBackup = async (options = { type: 'full' }) => {
  const allQuotations = await getAllQuotations();
  let exportQuotations = allQuotations;

  // Filter for partial backup if requested
  if (options.type === 'date-range' && options.startDate && options.endDate) {
    const start = new Date(options.startDate).setHours(0,0,0,0);
    const end = new Date(options.endDate).setHours(23,59,59,999);
    
    exportQuotations = allQuotations.filter(q => {
      const qTime = new Date(q.createdAt).getTime();
      return qTime >= start && qTime <= end;
    });
  }

  const backupData = {
    metadata: {
      version: '1.0',
      timestamp: new Date().toISOString(),
      type: options.type,
      totalQuotations: exportQuotations.length
    },
    settings: getAppLocalStorageData(),
    quotations: exportQuotations
  };

  return JSON.stringify(backupData, null, 2);
};

/**
 * VALIDATION SERVICE
 * Ensures the incoming JSON is a valid Amman Earth Movers backup file.
 */
export const validateBackup = (backupObj) => {
  if (!backupObj || typeof backupObj !== 'object') throw new Error("Invalid backup format.");
  if (!backupObj.metadata || !backupObj.metadata.version) throw new Error("Missing backup metadata.");
  if (!Array.isArray(backupObj.quotations)) throw new Error("Quotations data is missing or corrupt.");
  return true;
};

/**
 * RESTORE SERVICE
 * Safely merges a backup JSON string into the current device's storage.
 */
export const restoreFromBackup = async (jsonString) => {
  try {
    const backupObj = JSON.parse(jsonString);
    validateBackup(backupObj);

    // 1. Restore Quotations (Merge Strategy: Upsert)
    const existingQuotations = await getAllQuotations();
    const existingIds = new Set(existingQuotations.map(q => q.id));

    let importedCount = 0;
    let updatedCount = 0;

    for (const quote of backupObj.quotations) {
      if (existingIds.has(quote.id)) {
        updatedCount++;
      } else {
        importedCount++;
      }
      // saveQuotation natively acts as an upsert in localforage
      await saveQuotation(quote);
    }

    // 2. Restore Settings (Merge Strategy: Protect Sequence Counters)
    let settingsRestored = 0;
    if (backupObj.settings) {
      const localCounter = getSettings('quoteCounter') || { currentYearStr: '', lastSequence: 0 };
      
      for (const [key, value] of Object.entries(backupObj.settings)) {
        const rawKey = key.replace('aem_settings_', '');
        
        // COUNTER PROTECTION:
        // We absolutely must prevent a backup from rolling back the reference number sequence,
        // otherwise new quotes will generate duplicate IDs.
        if (rawKey === 'quoteCounter') {
          const backupYear = value.currentYearStr || value.currentFY;
          const localYear = localCounter.currentYearStr || localCounter.currentFY;
          if (backupYear === localYear) {
            value.lastSequence = Math.max(value.lastSequence || 0, localCounter.lastSequence || 0);
          }
        }
        
        saveSettings(rawKey, value);
        settingsRestored++;
      }
    }

    return { 
      success: true, 
      importedCount,
      updatedCount,
      settingsRestored,
      total: backupObj.quotations.length 
    };
    
  } catch (err) {
    console.error("Restore failed:", err);
    return { success: false, error: err.message };
  }
};
