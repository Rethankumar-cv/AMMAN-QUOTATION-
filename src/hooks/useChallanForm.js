import { useState, useEffect, useRef } from 'react';

export const createEmptyChallan = () => ({
  id: crypto.randomUUID(),
  dcNo: '',
  date: new Date().toISOString().split('T')[0],
  eWayBillNo: '',
  transporterName: '',
  time: '',
  vehicleNo: '',
  reason: 'Hiring',
  transactionType: 'Bill From - Dispatch From',
  billFrom: { name: 'AMMAN EARTH MOVERS', gst: '33AOMPC9735L1ZK', address: '60-A, NGR Street, Kalapatti, Coimbatore - 641 048', state: 'TAMILNADU' },
  billTo: { name: '', gst: '', address: '', state: '' },
  dispatchFrom: { address1: '60-A, NGR Street, Kalapatti', address2: 'Coimbatore - 641 048', cityStatePin: 'TAMILNADU' },
  shipTo: { address1: '', address2: '', cityStatePin: '' },
  items: [
    { id: crypto.randomUUID(), sno: 1, description: '', hsn: '', qty: 1, rate: 0, total: 0 }
  ],
  pricing: { subtotal: 0, cgst: 0, sgst: 0, roundOff: 0, grandTotal: 0 },
  notes: "1. Movement of goods only; not a tax invoice.\n2. GST / e-way bill details to be filled as applicable.\n3. Driver / fuel / transport charges are separate if applicable.",
  authorizedSignatory: 'Authorized Signatory',
  receiverSignature: '',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const calculateChallanTotals = (items, cgstStr, sgstStr, roundOffStr) => {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  const cgst = Number(cgstStr) || 0;
  const sgst = Number(sgstStr) || 0;
  const roundOff = Number(roundOffStr) || 0;
  
  const grandTotal = subtotal + cgst + sgst + roundOff;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    roundOff: Math.round(roundOff * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
};

export const useChallanForm = (challanId = null) => {
  const wipKey = challanId ? `aem_edit_challan_${challanId}` : 'aem_wip_challan';

  const loadInitialState = () => {
    const stored = localStorage.getItem(wipKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse WIP draft", e);
      }
    }
    return createEmptyChallan();
  };

  const [formData, setFormData] = useState(loadInitialState);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
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

  // Auto-update DC Number when Date changes
  useEffect(() => {
    if (formData.date) {
      const dateStr = formData.date.replace(/-/g, '');
      let serial = '001';
      
      if (formData.dcNo && formData.dcNo.startsWith('DC-')) {
        const parts = formData.dcNo.split('-');
        if (parts.length >= 3) {
          serial = parts.slice(2).join('-');
        }
      }
      
      const newDcNo = `DC-${dateStr}-${serial}`;
      if (formData.dcNo !== newDcNo) {
        setFormData(prev => ({ ...prev, dcNo: newDcNo }));
      }
    }
  }, [formData.date]);

  const clearDraft = () => {
    localStorage.removeItem(wipKey);
    setFormData(createEmptyChallan());
    setErrors({});
    setSaveStatus('');
  };

  const forceSaveDraft = () => {
    localStorage.setItem(wipKey, JSON.stringify(formData));
    setSaveStatus('Draft saved manually');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors['date'] = 'Date is required';
    
    if (formData.transactionType === 'Bill From - Dispatch From' || formData.transactionType === 'Both') {
      if (!formData.billFrom.name) newErrors['billFrom.name'] = 'Bill From Name is required';
      if (!formData.dispatchFrom.address1) newErrors['dispatchFrom.address1'] = 'Dispatch From Address is required';
    }
    
    if (formData.transactionType === 'Bill To - Ship To' || formData.transactionType === 'Both') {
      if (!formData.billTo.name) newErrors['billTo.name'] = 'Bill To Name is required';
      if (!formData.shipTo.address1) newErrors['shipTo.address1'] = 'Ship To Address is required';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.description) newErrors[`items.${index}.description`] = 'Description required';
      if (item.qty <= 0) newErrors[`items.${index}.qty`] = 'Qty must be > 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'qty' || field === 'rate') {
        const qty = Number(newItems[index].qty) || 0;
        const rate = Number(newItems[index].rate) || 0;
        newItems[index].total = Math.round((qty * rate) * 100) / 100;
      }
      
      const newPricing = calculateChallanTotals(newItems, prev.pricing.cgst, prev.pricing.sgst, prev.pricing.roundOff);
      
      return { ...prev, items: newItems, pricing: newPricing };
    });
    setErrors(prev => ({ ...prev, [`items.${index}.${field}`]: null }));
  };

  const handlePricingChange = (field, value) => {
    setFormData(prev => {
      let tempPricing = { ...prev.pricing, [field]: value };
      const newPricing = calculateChallanTotals(prev.items, tempPricing.cgst, tempPricing.sgst, tempPricing.roundOff);
      return { ...prev, pricing: newPricing };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), sno: prev.items.length + 1, description: '', hsn: '', qty: 1, rate: 0, total: 0 }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, sno: i + 1 }));
      const newPricing = calculateChallanTotals(newItems, prev.pricing.cgst, prev.pricing.sgst, prev.pricing.roundOff);
      return { ...prev, items: newItems, pricing: newPricing };
    });
  };

  return {
    formData,
    errors,
    saveStatus,
    clearDraft,
    forceSaveDraft,
    validateForm,
    setFormData,
    wipKey,
    handleBaseChange,
    handleNestedChange,
    handleItemChange,
    handlePricingChange,
    addItem,
    removeItem
  };
};
