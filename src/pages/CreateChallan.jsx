import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Save, Lock, ChevronLeft, Edit3, Plus, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { useChallanForm } from '../hooks/useChallanForm';
import { getChallanById, saveChallan } from '../services/challanService';

const CreateChallan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    handleBaseChange,
    handleNestedChange,
    handleItemChange,
    handlePricingChange,
    addItem,
    removeItem
  } = useChallanForm(id);

  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    const loadChallan = async () => {
      if (isEditMode) {
        const hasLocalWip = !!localStorage.getItem(wipKey);
        if (!hasLocalWip) {
          const dbChallan = await getChallanById(id);
          if (dbChallan) setFormData(dbChallan);
        }
      }
      setIsLoading(false);
    };
    loadChallan();
  }, [id, isEditMode, wipKey, setFormData]);

  const isFinalized = formData.status === 'finalized';
  const hasErrors = Object.keys(errors).length > 0;

  const handleReview = () => {
    if (validateForm()) {
      navigate(isEditMode ? `/preview-challan/${id}` : '/preview-challan/draft');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraftToDB = async () => {
    forceSaveDraft();
    let draftData = { ...formData, status: 'draft', updatedAt: new Date().toISOString() };
    await saveChallan(draftData);
    if (!isEditMode) localStorage.removeItem(wipKey);
    window.alert("Delivery Challan draft saved successfully!");
    navigate('/history?tab=challans');
  };

  const handleFinalSave = async () => {
    if (validateForm()) {
      let finalData = { ...formData, status: 'finalized', updatedAt: new Date().toISOString() };
      const savedChallan = await saveChallan(finalData);
      if (!isEditMode) localStorage.removeItem(wipKey);
      else localStorage.removeItem(`aem_edit_challan_${id}`);
      
      window.alert("Delivery Challan generated successfully!");
      navigate(`/preview-challan/${savedChallan.id}`);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear all form data? This cannot be undone.")) {
      clearDraft();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '140px' }}>
      <Card style={{ backgroundColor: 'var(--color-grey-900)', color: 'white', padding: '24px', border: 'none', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', margin: '-24px -16px 8px -16px' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'white' }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
              {isEditMode ? (isFinalized ? 'View Delivery Challan' : 'Edit Delivery Challan') : 'New Delivery Challan'}
            </h1>
            <div className="flex items-center gap-2 mt-1" style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
              {isFinalized ? <Lock size={14} /> : <Edit3 size={14} />}
              <span>{isFinalized ? 'Locked Archive' : 'Draft Workspace'}</span>
              {!isFinalized && saveStatus && (
                <span className="flex items-center gap-1" style={{ marginLeft: '12px', color: 'var(--color-orange-500)' }}>
                  {saveStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {hasErrors && (
        <Card style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error)', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle color="var(--color-error)" size={24} style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ color: 'var(--color-error)', margin: '0 0 4px 0', fontSize: 'var(--font-size-md)' }}>Action Required</h3>
            <p style={{ color: 'var(--color-error)', margin: 0, fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              Please fix the highlighted fields before proceeding.
            </p>
          </div>
        </Card>
      )}

      <div style={{ opacity: isFinalized ? 0.6 : 1, pointerEvents: isFinalized ? 'none' : 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        <Card>
          <SectionHeader title="Challan Details" subtitle="Primary dispatch information." />
          
          {/* Intelligent DC Number UI */}
          <div className="form-group mb-4">
            <label className="form-label">DC Number <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              <div style={{ backgroundColor: 'var(--color-grey-100)', color: 'var(--color-grey-600)', padding: '0 16px', borderRadius: '14px', height: '52px', display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                DC
              </div>
              <span style={{ color: 'var(--color-grey-400)', fontWeight: 'bold' }}>-</span>
              <div style={{ backgroundColor: 'var(--color-grey-100)', color: 'var(--color-grey-600)', padding: '0 16px', borderRadius: '14px', height: '52px', display: 'flex', alignItems: 'center', fontWeight: 'bold', flex: 1, fontSize: '15px', justifyContent: 'center' }}>
                {formData.date ? formData.date.replace(/-/g, '') : 'YYYYMMDD'}
              </div>
              <span style={{ color: 'var(--color-grey-400)', fontWeight: 'bold' }}>-</span>
              <input 
                type="text" 
                className="form-input" 
                style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '15px', paddingLeft: '8px', paddingRight: '8px' }} 
                value={formData.dcNo && formData.dcNo.startsWith('DC-') ? formData.dcNo.split('-').slice(2).join('-') : ''}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length > 4) val = val.slice(0, 4);
                  const dateStr = formData.date ? formData.date.replace(/-/g, '') : '';
                  handleBaseChange({ target: { name: 'dcNo', value: `DC-${dateStr}-${val}` } });
                }}
                placeholder="Serial (e.g. 250)"
                maxLength={4}
              />
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Date section updates automatically. Edit the serial number as needed.</p>
          </div>

          <div className="grid-cols-2">
            <Input label="Date" name="date" type="date" value={formData.date} onChange={handleBaseChange} error={errors['date']} required />
            <Input label="Time" name="time" type="time" value={formData.time} onChange={handleBaseChange} />
          </div>
          <div className="grid-cols-2">
            <Input label="Vehicle No" name="vehicleNo" value={formData.vehicleNo} onChange={handleBaseChange} placeholder="e.g. TN-38-XX-0000" />
            <Input label="Transporter Name" name="transporterName" value={formData.transporterName} onChange={handleBaseChange} placeholder="Enter Transporter" />
          </div>
          <div className="grid-cols-2">
            <Input label="E-Way Bill No" name="eWayBillNo" value={formData.eWayBillNo} onChange={handleBaseChange} placeholder="If applicable" />
            <Select label="Reason" name="reason" value={formData.reason} onChange={handleBaseChange} options={[{ value: 'Hiring', label: 'Hiring' }, { value: 'Delivery', label: 'Delivery' }, { value: 'Return', label: 'Return' }]} />
          </div>
          <Select 
            label="Transaction Type" 
            name="transactionType" 
            value={formData.transactionType} 
            onChange={handleBaseChange} 
            options={[
              { value: 'Bill From - Dispatch From', label: 'Bill From - Dispatch From' }, 
              { value: 'Bill To - Ship To', label: 'Bill To - Ship To' },
              { value: 'Both', label: 'Both (Show All Sections)' }
            ]} 
          />
        </Card>

        <Card>
          <SectionHeader title="Parties" subtitle="Billing and Shipping addresses." />
          
          {(formData.transactionType === 'Bill From - Dispatch From' || formData.transactionType === 'Both') && (
            <div style={{ border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Bill From</h4>
              <div className="grid-cols-2 mb-2">
                <Input label="Company Name" value={formData.billFrom.name} onChange={(e) => handleNestedChange('billFrom', 'name', e.target.value)} error={errors['billFrom.name']} required />
                <Input label="GSTIN" value={formData.billFrom.gst} onChange={(e) => handleNestedChange('billFrom', 'gst', e.target.value)} />
              </div>
              <Input label="Address" value={formData.billFrom.address} onChange={(e) => handleNestedChange('billFrom', 'address', e.target.value)} />
            </div>
          )}
          
          {(formData.transactionType === 'Bill To - Ship To' || formData.transactionType === 'Both') && (
            <div style={{ border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Bill To</h4>
              <div className="grid-cols-2 mb-2">
                <Input label="Company Name" value={formData.billTo.name} onChange={(e) => handleNestedChange('billTo', 'name', e.target.value)} error={errors['billTo.name']} required />
                <Input label="GSTIN" value={formData.billTo.gst} onChange={(e) => handleNestedChange('billTo', 'gst', e.target.value)} />
              </div>
              <Input label="Address" value={formData.billTo.address} onChange={(e) => handleNestedChange('billTo', 'address', e.target.value)} />
            </div>
          )}

          <div className="grid-cols-2">
            {(formData.transactionType === 'Bill From - Dispatch From' || formData.transactionType === 'Both') && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Dispatch From</h4>
                <Input label="Address Line 1" value={formData.dispatchFrom.address1} onChange={(e) => handleNestedChange('dispatchFrom', 'address1', e.target.value)} error={errors['dispatchFrom.address1']} required />
                <div style={{ height: '8px' }} />
                <Input label="City / PIN" value={formData.dispatchFrom.cityStatePin} onChange={(e) => handleNestedChange('dispatchFrom', 'cityStatePin', e.target.value)} />
              </div>
            )}
            {(formData.transactionType === 'Bill To - Ship To' || formData.transactionType === 'Both') && (
              <div style={formData.transactionType === 'Bill To - Ship To' ? { gridColumn: '1 / -1' } : {}}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Ship To</h4>
                <Input label="Address Line 1" value={formData.shipTo.address1} onChange={(e) => handleNestedChange('shipTo', 'address1', e.target.value)} error={errors['shipTo.address1']} required />
                <div style={{ height: '8px' }} />
                <Input label="City / PIN" value={formData.shipTo.cityStatePin} onChange={(e) => handleNestedChange('shipTo', 'cityStatePin', e.target.value)} />
              </div>
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Goods Description" subtitle="Items being transported." />
          {formData.items.map((item, index) => (
            <div key={item.id} style={{ border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', position: 'relative' }}>
              {formData.items.length > 1 && (
                <button onClick={() => removeItem(index)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
              <div className="grid-cols-2 mb-2" style={{ paddingRight: '32px' }}>
                <Input label={`Item ${index + 1} Description`} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} error={errors[`items.${index}.description`]} required />
                <Input label="HSN Code" value={item.hsn} onChange={(e) => handleItemChange(index, 'hsn', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <Input label="Qty" type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} error={errors[`items.${index}.qty`]} />
                <Input label="Rate (₹)" type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} />
                <Input label="Total (₹)" type="number" value={item.total} readOnly style={{ backgroundColor: 'var(--color-grey-50)' }} />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addItem} style={{ width: '100%', borderStyle: 'dashed' }}>
            <Plus size={16} style={{ marginRight: '8px' }} /> Add Item Row
          </Button>
        </Card>

        <Card>
          <SectionHeader title="Tax & Summary" subtitle="Subtotals and final grand total." />
          <div className="grid-cols-2 mb-4">
            <Input label="CGST (₹)" type="number" value={formData.pricing.cgst} onChange={(e) => handlePricingChange('cgst', e.target.value)} />
            <Input label="SGST (₹)" type="number" value={formData.pricing.sgst} onChange={(e) => handlePricingChange('sgst', e.target.value)} />
          </div>
          <div className="grid-cols-2 mb-4">
            <Input label="Round Off (₹)" type="number" value={formData.pricing.roundOff} onChange={(e) => handlePricingChange('roundOff', e.target.value)} />
            <div style={{ padding: '16px', backgroundColor: 'var(--color-grey-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Grand Total</span>
              <span style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)', fontWeight: 'bold' }}>₹ {formData.pricing.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Terms & Notes" subtitle="Displayed at the bottom of the challan." />
          <Textarea 
            label="Challan Notes" 
            value={formData.notes} 
            onChange={handleBaseChange} 
            name="notes"
            rows={4}
          />
        </Card>
      </div>

      {!isFinalized && (
        <div className="no-print action-bar-glass">
          <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={handleReset} style={{ flexShrink: 0, padding: '12px', width: '48px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Trash2 size={18} color="var(--color-grey-500)" />
            </Button>
            <Button variant="outline" onClick={handleSaveDraftToDB} style={{ flex: 1, minWidth: '100px', padding: '12px', height: '48px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Save size={18} className="hidden sm:inline" style={{ marginRight: '8px' }} /> Save Draft
            </Button>
            <Button variant="outline" onClick={handleReview} style={{ flex: 1, minWidth: '100px', padding: '12px', height: '48px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Preview Draft
            </Button>
            <Button variant="primary" onClick={handleFinalSave} style={{ flex: 2, minWidth: '140px', padding: '12px', height: '48px', boxShadow: '0 4px 14px rgba(243, 146, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Final Save <ChevronLeft size={18} style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChallan;
