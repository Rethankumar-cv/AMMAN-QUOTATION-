/**
 * Reusable mapping function to transform raw quotation data into display-ready strings.
 * Ensures the Preview DOM and any future export modules share the exact same formatting logic.
 */
export const mapQuotationData = (data) => {
  if (!data) return null;
  
  const formatCurrency = (val) => Number(val || 0).toLocaleString('en-IN');
  const displayDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const reqDate = data.jobDetails?.requiredDate ? new Date(data.jobDetails.requiredDate).toLocaleDateString('en-IN') : 'N/A';
  
  const termsList = data.termsAndConditions?.keyTerms?.split('\n').filter(t => t.trim() !== '') || [];
  
  const priceRows = [];
  if (data.pricingBreakdown?.hireCharges !== '') priceRows.push({ label: 'Equipment Hire Charges', value: formatCurrency(data.pricingBreakdown.hireCharges) });
  if (Number(data.pricingBreakdown?.driverCharges) > 0) priceRows.push({ label: 'Driver Charges', value: formatCurrency(data.pricingBreakdown.driverCharges) });
  if (Number(data.pricingBreakdown?.fuelCharges) > 0) priceRows.push({ label: 'Fuel Charges', value: formatCurrency(data.pricingBreakdown.fuelCharges) });
  if (Number(data.pricingBreakdown?.transportCharges) > 0) priceRows.push({ label: 'Transportation / Mobilization', value: formatCurrency(data.pricingBreakdown.transportCharges) });
  if (Number(data.pricingBreakdown?.otherCharges) > 0) priceRows.push({ label: 'Other Charges', value: formatCurrency(data.pricingBreakdown.otherCharges) });

  const gstLabel = data.pricingBreakdown?.gstMode === 'percentage' 
    ? `GST (${data.pricingBreakdown?.gstPercentage || 0}%)` 
    : 'GST (Fixed Amount)';

  return {
    ...data,
    formatted: {
      displayDate,
      reqDate,
      termsList,
      priceRows,
      gstLabel,
      subTotal: formatCurrency(data.pricingBreakdown?.subTotal),
      gstAmount: formatCurrency(data.pricingBreakdown?.gstAmount),
      grandTotal: formatCurrency(data.pricingBreakdown?.grandTotal)
    }
  };
};
