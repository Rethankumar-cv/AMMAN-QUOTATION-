import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Save, RotateCcw, Hash, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { useQuotationForm } from '../hooks/useQuotationForm';
import { generateNextReferenceNumber } from '../utils/referenceGenerator';
import { getQuotationById } from '../services/quotationService';
import { detectDuplicate } from '../services/dataIntegrityService';

const CreateQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, we are in Edit Mode
  const isEditMode = !!id;

  const { 
    formData, 
    errors,
    saveStatus,
    clearDraft,
    forceSaveDraft,
    validateForm,
    setFormData,
    wipKey,
    handleCustomerChange, handleCustomerBlur,
    handleJobChange, handleJobBlur,
    handlePricingChange, handlePricingBlur,
    handleTermsChange, handleTermsBlur
  } = useQuotationForm(id);

  const [isLoading, setIsLoading] = useState(isEditMode);

  // Mount logic to handle Edit mode loading
  useEffect(() => {
    const loadQuote = async () => {
      if (isEditMode) {
        // If there's NO local WIP draft for this ID yet, pull it from DB
        const hasLocalWip = !!localStorage.getItem(wipKey);
        if (!hasLocalWip) {
          const dbQuote = await getQuotationById(id);
          if (dbQuote) {
            setFormData(dbQuote);
          }
        }
      }
      setIsLoading(false);
    };
    loadQuote();
  }, [id, isEditMode, wipKey, setFormData]);

  const isFinalized = formData.status === 'finalized';

  const handleReview = async () => {
    if (validateForm()) {
      const isDuplicate = await detectDuplicate(formData);
      if (isDuplicate) {
        const proceed = window.confirm("WARNING: A quotation for this customer, with the same equipment and total amount, was already created today. Are you sure you want to proceed and generate a duplicate?");
        if (!proceed) return;
      }

      let finalData = { ...formData };
      if (!finalData.quotationRefNo) {
        finalData.quotationRefNo = generateNextReferenceNumber();
        setFormData(finalData);
        localStorage.setItem(wipKey, JSON.stringify(finalData));
      }
      // Navigate to preview, passing the current WIP key identifier
      navigate(isEditMode ? `/preview/${id}` : '/preview/draft');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    const msg = isEditMode ? "Discard unsaved edits to this quotation?" : "Are you sure you want to reset? All unsaved progress will be lost.";
    if (window.confirm(msg)) {
      clearDraft();
      if (isEditMode) navigate(-1); // Back out if discarding edits
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    navigate(-1); // Safely go back, autosave protects them
  };

  if (isLoading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading quotation...</div>;
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '120px' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="btn-text" style={{ padding: '0 8px', fontSize: '24px' }}>&larr;</button>
          <h1 className="text-h1" style={{ margin: 0 }}>
            {isEditMode ? (isFinalized ? 'View Quotation' : 'Edit Draft') : 'New Quotation'}
          </h1>
        </div>
        {!isFinalized && saveStatus && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-orange-500)' }}></span>
            {saveStatus}
          </span>
        )}
      </div>

      {hasErrors && (
        <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <AlertCircle color="var(--color-error)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-bold)', margin: '0 0 4px 0', fontSize: 'var(--font-size-sm)' }}>
              Cannot proceed
            </p>
            <p style={{ color: 'var(--color-error)', margin: 0, fontSize: 'var(--font-size-xs)' }}>
              Please fix the highlighted errors below.
            </p>
          </div>
        </div>
      )}

      {/* Meta Bar */}
      <Card style={{ padding: '12px 16px', backgroundColor: 'var(--color-orange-100)', border: '1px solid var(--color-orange-500)' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Hash size={16} color="var(--color-orange-600)" />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Ref No.</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-orange-600)', fontWeight: 'var(--font-weight-bold)' }}>
            {formData.quotationRefNo || 'Auto-assigned on Review'}
          </span>
        </div>
        {isFinalized && (
          <div style={{ marginTop: '8px', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} /> This quotation is finalized and locked to prevent accounting errors.
          </div>
        )}
      </Card>

      {/* Form Fields - Disabled if Finalized */}
      <Card style={{ opacity: isFinalized ? 0.7 : 1, pointerEvents: isFinalized ? 'none' : 'auto' }}>
        <SectionHeader title="Customer Details" subtitle="Who is this quotation for?" />
        <Input 
          label="Customer Name" name="customerName"
          value={formData.customerDetails.customerName}
          onChange={handleCustomerChange} onBlur={handleCustomerBlur}
          error={errors['customerDetails.customerName']}
          placeholder="Enter name" required 
        />
        <Input 
          label="Company Name" name="companyName"
          value={formData.customerDetails.companyName}
          onChange={handleCustomerChange} onBlur={handleCustomerBlur}
          placeholder="Enter company" 
        />
        <Input 
          label="Mobile No." name="mobileNo" type="tel" 
          value={formData.customerDetails.mobileNo}
          onChange={handleCustomerChange} onBlur={handleCustomerBlur}
          error={errors['customerDetails.mobileNo']}
          placeholder="10-digit number" required 
        />
        <Input 
          label="GST / PAN" name="gstPan"
          value={formData.customerDetails.gstPan}
          onChange={handleCustomerChange} onBlur={handleCustomerBlur}
          error={errors['customerDetails.gstPan']}
          placeholder="Enter GST or PAN" 
        />
      </Card>

      <Card style={{ opacity: isFinalized ? 0.7 : 1, pointerEvents: isFinalized ? 'none' : 'auto' }}>
        <SectionHeader title="Job / Rental Details" subtitle="Equipment and location specs." />
        <Select 
          label="Vehicle / Equipment" name="equipmentType"
          value={formData.jobDetails.equipmentType}
          onChange={handleJobChange} onBlur={handleJobBlur}
          error={errors['jobDetails.equipmentType']}
          options={[{ value: 'Tipper', label: 'Tipper' }, { value: 'JCB', label: 'JCB' }, { value: 'Crane', label: 'Crane' }, { value: 'Roller', label: 'Roller' }, { value: 'Bobcat', label: 'Bobcat' }]} 
          required 
        />
        <Select 
          label="Rental Basis" name="rentalBasis"
          value={formData.jobDetails.rentalBasis}
          onChange={handleJobChange} onBlur={handleJobBlur}
          error={errors['jobDetails.rentalBasis']}
          options={[{ value: 'Per Day', label: 'Per Day' }, { value: 'Per Hour', label: 'Per Hour' }, { value: 'Per Trip', label: 'Per Trip' }]} 
          required 
        />
        <Input 
          label="Work Location" name="workLocation"
          value={formData.jobDetails.workLocation}
          onChange={handleJobChange} onBlur={handleJobBlur}
          error={errors['jobDetails.workLocation']}
          placeholder="Enter location" required 
        />
        <Input 
          label="Required Date" name="requiredDate" type="date" 
          value={formData.jobDetails.requiredDate}
          onChange={handleJobChange} onBlur={handleJobBlur}
          error={errors['jobDetails.requiredDate']}
          required 
        />
      </Card>

      <Card style={{ opacity: isFinalized ? 0.7 : 1, pointerEvents: isFinalized ? 'none' : 'auto' }}>
        <SectionHeader title="Price Breakdown" subtitle="Base rates and additional charges." />
        <Input 
          label="Vehicle/Equipment Hire Charges" name="hireCharges" type="number" 
          value={formData.pricingBreakdown.hireCharges}
          onChange={handlePricingChange} onBlur={handlePricingBlur}
          error={errors['pricingBreakdown.hireCharges']}
          placeholder="Enter Amount" required 
        />
        <Input 
          label="Driver Charges" name="driverCharges" type="number" 
          value={formData.pricingBreakdown.driverCharges}
          onChange={handlePricingChange} onBlur={handlePricingBlur}
          error={errors['pricingBreakdown.driverCharges']}
          placeholder="Enter Amount or 0" 
        />
        <Input 
          label="Fuel Charges" name="fuelCharges" type="number" 
          value={formData.pricingBreakdown.fuelCharges}
          onChange={handlePricingChange} onBlur={handlePricingBlur}
          error={errors['pricingBreakdown.fuelCharges']}
          placeholder="Enter Amount or 0" 
        />
        <Input 
          label="Transportation / Mobilization" name="transportCharges" type="number" 
          value={formData.pricingBreakdown.transportCharges}
          onChange={handlePricingChange} onBlur={handlePricingBlur}
          error={errors['pricingBreakdown.transportCharges']}
          placeholder="Enter Amount or 0" 
        />
        <Input 
          label="Other Charges" name="otherCharges" type="number" 
          value={formData.pricingBreakdown.otherCharges}
          onChange={handlePricingChange} onBlur={handlePricingBlur}
          error={errors['pricingBreakdown.otherCharges']}
          placeholder="Enter Amount or 0" 
        />
        
        <div style={{ backgroundColor: 'var(--color-grey-50)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border-default)' }}>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label" style={{ margin: 0 }}>GST Calculation</label>
            <select 
              name="gstMode" 
              value={formData.pricingBreakdown.gstMode || 'percentage'} 
              onChange={handlePricingChange}
              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-grey-300)', fontSize: 'var(--font-size-xs)', backgroundColor: 'white' }}
            >
              <option value="percentage">% Percentage</option>
              <option value="fixed">₹ Fixed Amount</option>
            </select>
          </div>
          
          {formData.pricingBreakdown.gstMode === 'fixed' ? (
            <Input 
              name="gstFixedAmount" type="number" 
              value={formData.pricingBreakdown.gstFixedAmount}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.gstFixedAmount']}
              placeholder="Enter Exact GST Amount (₹)" className="mb-0"
            />
          ) : (
            <Input 
              name="gstPercentage" type="number" 
              value={formData.pricingBreakdown.gstPercentage}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.gstPercentage']}
              placeholder="Enter GST Percentage (%)" className="mb-0"
            />
          )}
        </div>
        
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <div className="flex justify-between" style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <span>Subtotal</span>
            <span>₹ {formData.pricingBreakdown.subTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between" style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <span>GST Amount</span>
            <span>₹ {formData.pricingBreakdown.gstAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>
            <span>GRAND TOTAL</span>
            <span className="text-brand-orange">₹ {formData.pricingBreakdown.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card style={{ opacity: isFinalized ? 0.7 : 1, pointerEvents: isFinalized ? 'none' : 'auto' }}>
        <SectionHeader title="Terms & Conditions" subtitle="Default terms can be edited below." />
        <Textarea 
          label="Key Terms" name="keyTerms"
          value={formData.termsAndConditions.keyTerms}
          onChange={handleTermsChange} onBlur={handleTermsBlur}
          error={errors['termsAndConditions.keyTerms']}
          required 
        />
      </Card>

      {/* Manual Actions Card (Hidden if finalized) */}
      {!isFinalized && (
        <Card style={{ backgroundColor: 'var(--bg-app)', borderStyle: 'dashed' }}>
          <div className="flex justify-between items-center gap-4">
            <Button variant="text" onClick={handleReset} style={{ color: 'var(--color-error)', flex: 1, padding: '8px' }}>
              <RotateCcw size={16} style={{ marginRight: '8px' }} /> Discard Edits
            </Button>
            <Button variant="outline" onClick={forceSaveDraft} style={{ flex: 1, padding: '8px' }}>
              <Save size={16} style={{ marginRight: '8px' }} /> Save Progress
            </Button>
          </div>
        </Card>
      )}

      {/* Sticky Bottom Action Area */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', 
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)', zIndex: 90, 
        maxWidth: '768px', margin: '0 auto' 
      }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Grand Total</span>
          <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>₹ {formData.pricingBreakdown.grandTotal.toLocaleString()}</span>
        </div>
        {isFinalized ? (
          <Button variant="primary" className="w-full" onClick={() => navigate(`/preview/${id}`)}>
            Open Document Viewer
          </Button>
        ) : (
          <Button variant="primary" className="w-full" onClick={handleReview}>
            Review & Finalize Quotation
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateQuotation;
