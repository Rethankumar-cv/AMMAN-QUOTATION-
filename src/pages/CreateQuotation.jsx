import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Save, RotateCcw, Hash, Lock, CheckCircle2, ChevronLeft, Edit3, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { useQuotationForm } from '../hooks/useQuotationForm';
import { generateNextReferenceNumber } from '../utils/referenceGenerator';
import { getQuotationById, saveQuotation } from '../services/quotationService';
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

  useEffect(() => {
    const loadQuote = async () => {
      if (isEditMode) {
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
      navigate(isEditMode ? `/preview/${id}` : '/preview/draft');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraftToDB = async () => {
    // We want to force save to local state first just in case
    forceSaveDraft();
    
    let draftData = { ...formData, status: 'draft', updatedAt: new Date().toISOString() };
    
    // Assign a ref number if it doesn't have one so it looks good in history
    if (!draftData.quotationRefNo) {
      draftData.quotationRefNo = generateNextReferenceNumber();
      setFormData(draftData);
    }
    
    // Save to actual IndexedDB so it appears in Dashboard and History
    await saveQuotation(draftData);
    
    // If we're not in edit mode (meaning we are creating a new one), we should clear the WIP draft 
    // because it has now been promoted to a real database draft.
    if (!isEditMode) {
      localStorage.removeItem(wipKey);
    }
    
    window.alert("Draft saved successfully! You can find it in your Quotation History.");
    navigate('/history');
  };

  const handleReset = () => {
    const msg = isEditMode ? "Discard unsaved edits to this quotation?" : "Are you sure you want to reset? All unsaved progress will be lost.";
    if (window.confirm(msg)) {
      clearDraft();
      if (isEditMode) navigate(-1);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading workspace...</div>;
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '140px' }}>
      
      {/* Premium Top Area */}
      <Card style={{ backgroundColor: 'var(--color-grey-900)', color: 'white', padding: '24px', border: 'none', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', margin: '-24px -16px 8px -16px' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'white' }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
              {isEditMode ? (isFinalized ? 'View Document' : 'Edit Quotation') : 'New Quotation'}
            </h1>
            <div className="flex items-center gap-2 mt-1" style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
              {isFinalized ? <Lock size={14} /> : <Edit3 size={14} />}
              <span>{isFinalized ? 'Locked Archive' : 'Draft Workspace'}</span>
              
              {!isFinalized && saveStatus && (
                <span className="flex items-center gap-1" style={{ marginLeft: '12px', color: 'var(--color-orange-500)' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                  {saveStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-2">
            <Hash size={16} color="var(--color-orange-500)" />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-grey-400)' }}>Reference No.</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-orange-500)', fontWeight: 'var(--font-weight-bold)' }}>
            {formData.quotationRefNo || 'Pending generation'}
          </span>
        </div>
      </Card>

      {hasErrors && (
        <Card style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle color="var(--color-error)" size={24} style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ color: 'var(--color-error)', margin: '0 0 4px 0', fontSize: 'var(--font-size-md)' }}>Action Required</h3>
            <p style={{ color: 'var(--color-error)', margin: 0, fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              Please fix the highlighted fields before proceeding to preview.
            </p>
          </div>
        </Card>
      )}

      {/* Form Fields Workspace */}
      <div style={{ opacity: isFinalized ? 0.6 : 1, pointerEvents: isFinalized ? 'none' : 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Customer Information */}
        <Card>
          <SectionHeader title="Customer Information" subtitle="Billing details for the client." />
          <div className="grid-cols-2">
            <Input 
              label="Customer Name" name="customerName"
              value={formData.customerDetails.customerName}
              onChange={handleCustomerChange} onBlur={handleCustomerBlur}
              error={errors['customerDetails.customerName']}
              placeholder="Enter full name" required 
            />
            <Input 
              label="Company Name" name="companyName"
              value={formData.customerDetails.companyName}
              onChange={handleCustomerChange} onBlur={handleCustomerBlur}
              placeholder="Enter company (optional)" 
            />
          </div>
          <div className="grid-cols-2">
            <Input 
              label="Mobile Number" name="mobileNo" type="tel" 
              value={formData.customerDetails.mobileNo}
              onChange={handleCustomerChange} onBlur={handleCustomerBlur}
              error={errors['customerDetails.mobileNo']}
              placeholder="10-digit mobile number" required 
            />
            <Input 
              label="GST / PAN" name="gstPan"
              value={formData.customerDetails.gstPan}
              onChange={handleCustomerChange} onBlur={handleCustomerBlur}
              error={errors['customerDetails.gstPan']}
              placeholder="Tax ID (optional)" 
            />
          </div>
        </Card>

        {/* Job Details */}
        <Card>
          <SectionHeader title="Job & Rental Details" subtitle="Equipment specifications and scheduling." />
          <div className="grid-cols-2">
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
          </div>
          <div className="grid-cols-2">
            <Input 
              label="Work Location" name="workLocation"
              value={formData.jobDetails.workLocation}
              onChange={handleJobChange} onBlur={handleJobBlur}
              error={errors['jobDetails.workLocation']}
              placeholder="Deployment site" required 
            />
            <Input 
              label="Required Date" name="requiredDate" type="date" 
              value={formData.jobDetails.requiredDate}
              onChange={handleJobChange} onBlur={handleJobBlur}
              error={errors['jobDetails.requiredDate']}
              required 
            />
          </div>
        </Card>

        {/* Pricing Information */}
        <Card>
          <SectionHeader title="Pricing Breakdown" subtitle="Base rates and supplementary charges." />
          
          <div className="grid-cols-2" style={{ marginBottom: '16px' }}>
            <Input 
              label="Vehicle/Equipment Hire" name="hireCharges" type="number" 
              value={formData.pricingBreakdown.hireCharges}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.hireCharges']}
              placeholder="₹ Base Rate" required 
            />
            <Input 
              label="Driver Charges" name="driverCharges" type="number" 
              value={formData.pricingBreakdown.driverCharges}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.driverCharges']}
              placeholder="₹ 0" 
            />
          </div>
          
          <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
            <Input 
              label="Fuel Charges" name="fuelCharges" type="number" 
              value={formData.pricingBreakdown.fuelCharges}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.fuelCharges']}
              placeholder="₹ 0" 
            />
            <Input 
              label="Transportation / Mobilization" name="transportCharges" type="number" 
              value={formData.pricingBreakdown.transportCharges}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.transportCharges']}
              placeholder="₹ 0" 
            />
            <Input 
              label="Other Charges" name="otherCharges" type="number" 
              value={formData.pricingBreakdown.otherCharges}
              onChange={handlePricingChange} onBlur={handlePricingBlur}
              error={errors['pricingBreakdown.otherCharges']}
              placeholder="₹ 0" 
            />
          </div>
          
          {/* Tax Section */}
          <div style={{ backgroundColor: 'var(--color-grey-50)', padding: '20px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', border: '1px solid var(--border-default)' }}>
            <div className="flex justify-between items-center mb-4">
              <label className="form-label" style={{ margin: 0, color: 'var(--text-primary)' }}>Tax Calculation (GST)</label>
              <select 
                name="gstMode" 
                value={formData.pricingBreakdown.gstMode || 'percentage'} 
                onChange={handlePricingChange}
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-grey-300)', fontSize: 'var(--font-size-sm)', backgroundColor: 'white', outline: 'none' }}
              >
                <option value="percentage">% Percentage Mode</option>
                <option value="fixed">₹ Fixed Amount Mode</option>
              </select>
            </div>
            
            {formData.pricingBreakdown.gstMode === 'fixed' ? (
              <Input 
                name="gstFixedAmount" type="number" 
                value={formData.pricingBreakdown.gstFixedAmount}
                onChange={handlePricingChange} onBlur={handlePricingBlur}
                error={errors['pricingBreakdown.gstFixedAmount']}
                placeholder="Enter exact GST Amount (₹)" 
              />
            ) : (
              <Input 
                name="gstPercentage" type="number" 
                value={formData.pricingBreakdown.gstPercentage}
                onChange={handlePricingChange} onBlur={handlePricingBlur}
                error={errors['pricingBreakdown.gstPercentage']}
                placeholder="Enter GST Percentage (%)" 
              />
            )}
          </div>
          
          {/* Summary Card */}
          <div style={{ backgroundColor: 'var(--color-grey-900)', color: 'white', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between" style={{ marginBottom: '12px', color: 'var(--color-grey-400)', fontSize: 'var(--font-size-sm)' }}>
              <span>Subtotal</span>
              <span>₹ {formData.pricingBreakdown.subTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '16px', color: 'var(--color-grey-400)', fontSize: 'var(--font-size-sm)' }}>
              <span>GST Amount</span>
              <span>₹ {formData.pricingBreakdown.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-grey-600)', paddingTop: '16px' }} className="flex justify-between items-center">
              <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-md)', letterSpacing: '0.5px' }}>GRAND TOTAL</span>
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-orange-500)' }}>
                ₹ {formData.pricingBreakdown.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Card>

        {/* Additional Notes */}
        <Card>
          <SectionHeader title="Terms & Conditions" subtitle="Document terms automatically inherit from your defaults." />
          <Textarea 
            name="keyTerms"
            value={formData.termsAndConditions.keyTerms}
            onChange={handleTermsChange} onBlur={handleTermsBlur}
            error={errors['termsAndConditions.keyTerms']}
            required 
          />
        </Card>

        {/* Manual Save Actions (Hidden if finalized) */}
        {!isFinalized && (
          <div className="flex gap-4" style={{ marginBottom: '24px' }}>
            <Button variant="outline" onClick={handleReset} style={{ flex: 1, backgroundColor: 'white' }}>
              <RotateCcw size={16} /> {isEditMode ? 'Discard Edits' : 'Clear Form'}
            </Button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Premium Action Area */}
      <div className="action-bar-glass">
        <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          <div style={{ flex: 1, display: 'none' }} className="sm:block">
            <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Estimate</span>
            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>₹ {formData.pricingBreakdown.grandTotal.toLocaleString('en-IN')}</span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
            {!isFinalized && (
              <Button variant="outline" className="w-full" onClick={handleSaveDraftToDB} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: 'var(--text-primary)' }}>
                <Save size={18} className="hidden sm:inline" style={{ marginRight: '4px' }} /> Save
              </Button>
            )}
            
            {isFinalized ? (
              <Button variant="primary" className="w-full" onClick={() => navigate(`/preview/${id}`)} style={{ flex: 2, padding: '14px' }}>
                Open Viewer <ArrowRight size={18} style={{ marginLeft: '4px' }} />
              </Button>
            ) : (
              <Button variant="primary" className="w-full" onClick={handleReview} style={{ flex: 2, padding: '14px', boxShadow: '0 4px 14px rgba(243, 146, 0, 0.4)' }}>
                Preview <ArrowRight size={18} style={{ marginLeft: '4px' }} />
              </Button>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default CreateQuotation;
