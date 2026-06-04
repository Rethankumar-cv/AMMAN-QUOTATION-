import { useState, useEffect, useRef } from 'react';
import { createEmptyQuotation } from '../models/quotation';
import { calculatePricing } from '../utils/calculations';

/**
 * Custom React Hook to manage quotation form state, validation, and auto-save.
 * Accepts a quoteId to safely isolate edits of existing quotations from new ones.
 */
export const useQuotationForm = (quoteId = null) => {
  
  const wipKey = quoteId ? `aem_edit_draft_${quoteId}` : 'aem_wip_draft';

  // Load from WIP, enabling seamless draft restoration
  const loadInitialState = () => {
    const stored = localStorage.getItem(wipKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse WIP draft", e);
      }
    }
    return createEmptyQuotation();
  };

  const [formData, setFormData] = useState(loadInitialState);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(''); // 'Saving...', 'Draft auto-saved'
  
  const saveTimeoutRef = useRef(null);

  // Autosave to localStorage on data change (debounced)
  useEffect(() => {
    // Only autosave if the form is actually populated, don't spam saves for empty loads
    if (!formData.id) return;
    
    setSaveStatus('Saving...');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(wipKey, JSON.stringify(formData));
      setSaveStatus('Draft auto-saved');
      
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000); 
    
    return () => clearTimeout(saveTimeoutRef.current);
  }, [formData, wipKey]);

  const clearDraft = () => {
    localStorage.removeItem(wipKey);
    setFormData(createEmptyQuotation());
    setErrors({});
    setSaveStatus('');
  };

  const forceSaveDraft = () => {
    localStorage.setItem(wipKey, JSON.stringify(formData));
    setSaveStatus('Draft saved manually');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const validateField = (section, field, value) => {
    let errorMsg = '';
    const strVal = String(value || '');
    
    if (section === 'customerDetails') {
      if (field === 'customerName' && !strVal.trim()) errorMsg = 'Customer name is required.';
      if (field === 'mobileNo') {
        if (!strVal.trim()) errorMsg = 'Mobile number is required.';
        else if (!/^\d{10}$/.test(strVal.trim())) errorMsg = 'Enter a valid 10-digit mobile number.';
      }
      if (field === 'gstPan' && strVal.trim()) {
        const cleaned = strVal.trim().toUpperCase();
        if (cleaned.length !== 10 && cleaned.length !== 15) {
          errorMsg = 'GST should be 15 chars or PAN 10 chars.';
        }
      }
    }
    
    if (section === 'jobDetails') {
      if (field === 'equipmentType' && !strVal) errorMsg = 'Please select an equipment type.';
      if (field === 'rentalBasis' && !strVal) errorMsg = 'Please select a rental basis.';
      if (field === 'workLocation' && !strVal.trim()) errorMsg = 'Work location is required.';
      if (field === 'requiredDate' && !strVal) errorMsg = 'Required date is mandatory.';
    }
    
    if (section === 'pricingBreakdown') {
      if (field === 'hireCharges') {
        if (strVal === '') errorMsg = 'Hire charges are required.';
        else if (Number(value) < 0) errorMsg = 'Cannot be negative.';
      }
      if (['driverCharges', 'fuelCharges', 'transportCharges', 'otherCharges'].includes(field)) {
        if (Number(value) < 0) errorMsg = 'Cannot be negative.';
      }
      if (field === 'gstPercentage' && Number(value) < 0) errorMsg = 'Cannot be negative.';
      if (field === 'gstFixedAmount' && Number(value) < 0) errorMsg = 'Cannot be negative.';
    }
    
    if (section === 'termsAndConditions') {
      if (field === 'keyTerms' && !strVal.trim()) errorMsg = 'Terms and conditions cannot be empty.';
    }
    
    return errorMsg;
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => {
      const updatedSection = { ...prev[section], [field]: value };
      let updatedData = { ...prev, [section]: updatedSection };
      
      if (section === 'pricingBreakdown') {
        updatedData.pricingBreakdown = calculatePricing(updatedSection);
      }
      
      return updatedData;
    });

    if (errors[`${section}.${field}`]) {
      const errorMsg = validateField(section, field, value);
      if (!errorMsg) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`${section}.${field}`];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (section, field, value) => {
    const errorMsg = validateField(section, field, value);
    setErrors(prev => {
      if (errorMsg) return { ...prev, [`${section}.${field}`]: errorMsg };
      const newErrors = { ...prev };
      delete newErrors[`${section}.${field}`];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      { s: 'customerDetails', f: 'customerName' },
      { s: 'customerDetails', f: 'mobileNo' },
      { s: 'customerDetails', f: 'gstPan' },
      { s: 'jobDetails', f: 'equipmentType' },
      { s: 'jobDetails', f: 'rentalBasis' },
      { s: 'jobDetails', f: 'workLocation' },
      { s: 'jobDetails', f: 'requiredDate' },
      { s: 'pricingBreakdown', f: 'hireCharges' },
      { s: 'pricingBreakdown', f: 'driverCharges' },
      { s: 'pricingBreakdown', f: 'fuelCharges' },
      { s: 'pricingBreakdown', f: 'transportCharges' },
      { s: 'pricingBreakdown', f: 'otherCharges' },
      { s: 'pricingBreakdown', f: 'gstPercentage' },
      { s: 'pricingBreakdown', f: 'gstFixedAmount' },
      { s: 'termsAndConditions', f: 'keyTerms' }
    ];
    
    let isValid = true;
    fieldsToValidate.forEach(({s, f}) => {
      const val = formData[s][f];
      const errorMsg = validateField(s, f, val);
      if (errorMsg) {
        newErrors[`${s}.${f}`] = errorMsg;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const createChangeHandler = (section) => (e) => handleNestedChange(section, e.target.name, e.target.value);
  const createBlurHandler = (section) => (e) => handleBlur(section, e.target.name, e.target.value);

  return {
    formData,
    errors,
    saveStatus,
    clearDraft,
    forceSaveDraft,
    handleCustomerChange: createChangeHandler('customerDetails'),
    handleCustomerBlur: createBlurHandler('customerDetails'),
    handleJobChange: createChangeHandler('jobDetails'),
    handleJobBlur: createBlurHandler('jobDetails'),
    handlePricingChange: createChangeHandler('pricingBreakdown'),
    handlePricingBlur: createBlurHandler('pricingBreakdown'),
    handleTermsChange: createChangeHandler('termsAndConditions'),
    handleTermsBlur: createBlurHandler('termsAndConditions'),
    validateForm,
    setFormData,
    wipKey // Expose for deletion on finalize if needed
  };
};
