/**
 * Safely parses a value to a float, returning 0 if empty or invalid.
 * This ensures the app doesn't crash on weird inputs and handles empty fields gracefully.
 */
export const parseNumber = (val) => {
  if (val === '' || val === null || val === undefined) return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Calculates the subtotal from all pricing components.
 */
export const calculateSubtotal = (pricingData) => {
  const hire = parseNumber(pricingData.hireCharges);
  const driver = parseNumber(pricingData.driverCharges);
  const fuel = parseNumber(pricingData.fuelCharges);
  const transport = parseNumber(pricingData.transportCharges);
  const other = parseNumber(pricingData.otherCharges);
  
  return hire + driver + fuel + transport + other;
};

/**
 * Calculates GST amount. Supports both 'percentage' and 'fixed' modes.
 */
export const calculateGST = (subTotal, pricingData) => {
  const gstMode = pricingData.gstMode || 'percentage';
  
  if (gstMode === 'percentage') {
    const percent = parseNumber(pricingData.gstPercentage);
    return (subTotal * percent) / 100;
  } else {
    // Fixed amount mode
    return parseNumber(pricingData.gstFixedAmount);
  }
};

/**
 * Standard rounding to nearest Rupee for Indian accounting.
 */
export const roundAmount = (amount) => {
  return Math.round(amount);
};

/**
 * Main Calculation Engine
 * Re-computes everything instantly and safely.
 */
export const calculatePricing = (pricingData) => {
  const subTotal = calculateSubtotal(pricingData);
  const gstAmount = calculateGST(subTotal, pricingData);
  const grandTotal = roundAmount(subTotal + gstAmount);
  
  return {
    ...pricingData,
    subTotal,
    gstAmount,
    grandTotal
  };
};
