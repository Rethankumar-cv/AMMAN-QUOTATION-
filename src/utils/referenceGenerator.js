import { getSettings, saveSettings } from '../services/settingsService';

/**
 * Returns the two-digit year (e.g., 2026 -> "26").
 * @returns {string} Example: "26"
 */
const getCurrentYearStr = (date = new Date()) => {
  return date.getFullYear().toString().slice(-2);
};

/**
 * Generates the next sequential ID, updating localStorage to reserve it immediately.
 * Formats as: AEM/[YY]/[0001]
 */
export const generateNextReferenceNumber = () => {
  const currentYearStr = getCurrentYearStr();
  
  // Read state from localStorage
  let settings = getSettings('quoteCounter') || { currentYearStr: '', lastSequence: 0 };

  // Handle migration from old 'currentFY' structure if it exists
  if (settings.currentFY && !settings.currentYearStr) {
    settings.currentYearStr = ''; // Force reset
    delete settings.currentFY;
  }

  // Check if year rolled over (e.g., Jan 1st hit)
  if (settings.currentYearStr !== currentYearStr) {
    settings.currentYearStr = currentYearStr;
    settings.lastSequence = 0; // Reset counter for the new year
  }

  // Increment sequence strictly forward
  settings.lastSequence += 1;
  
  // Save new counter state synchronously to "burn/reserve" the number
  saveSettings('quoteCounter', settings);

  // Pad the sequence with zeros (e.g., 0042)
  const sequenceString = settings.lastSequence.toString().padStart(4, '0');
  
  return `AEM/${currentYearStr}/${sequenceString}`;
};
