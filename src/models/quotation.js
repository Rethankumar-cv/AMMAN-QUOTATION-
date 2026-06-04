import { getSettings } from '../services/settingsService';

/**
 * Factory function to generate a new, structured quotation object.
 * Applies user settings as defaults if they exist.
 */
export const createEmptyQuotation = () => {
  const profile = getSettings('companyProfile') || {};
  const defaults = getSettings('quotationDefaults') || {};
  const branding = getSettings('branding') || {};

  return {
    id: crypto.randomUUID(), 
    quotationRefNo: '', 
    status: 'draft', 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerDetails: {
      customerName: '',
      companyName: '',
      mobileNo: '',
      gstPan: ''
    },
    jobDetails: {
      equipmentType: '',
      rentalBasis: '',
      workLocation: '',
      requiredDate: ''
    },
    pricingBreakdown: {
      hireCharges: '',
      driverCharges: '',
      fuelCharges: '',
      transportCharges: '',
      otherCharges: '',
      gstMode: 'percentage',
      gstPercentage: defaults.gstPercentage || '18',
      gstFixedAmount: '',
      gstAmount: 0,
      subTotal: 0,
      grandTotal: 0
    },
    termsAndConditions: {
      keyTerms: defaults.keyTerms || ""
    },
    brandingMetadata: {
      companyName: profile.companyName || 'AMMAN EARTH MOVERS',
      logoUrl: branding.logoUrl || '/assets/logo.png', // Fallback to static
      stampUrl: branding.stampUrl || '',
      signatureUrl: branding.signatureUrl || ''
    }
  };
};
