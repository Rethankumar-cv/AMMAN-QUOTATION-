import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Calendar, HardDrive, AlertTriangle, CheckCircle, Save, Image as ImageIcon, Building, Settings as SettingsIcon, FileText } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import { createBackup, restoreFromBackup } from '../services/backupRestoreService';
import { getSettings, saveSettings } from '../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState(null);
  
  // Data States
  const [profile, setProfile] = useState({});
  const [branding, setBranding] = useState({});
  const [defaults, setDefaults] = useState({});
  const [appPrefs, setAppPrefs] = useState({});

  useEffect(() => {
    setProfile(getSettings('companyProfile') || {});
    setBranding(getSettings('branding') || {});
    setDefaults(getSettings('quotationDefaults') || {});
    setAppPrefs(getSettings('appPrefs') || {});
  }, []);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveGroup = (key, data) => {
    saveSettings(key, data);
    showMsg('Settings saved successfully!');
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        return showMsg('Image is too large. Max 1MB.', 'error');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const newBranding = { ...branding, [field]: base64 };
        setBranding(newBranding);
        saveSettings('branding', newBranding);
        showMsg('Image updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ----- Backup Logic -----
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef(null);
  const [backupType, setBackupType] = useState('full');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const jsonString = await createBackup({ type: backupType, startDate, endDate });
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AEM_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      showMsg("Backup exported successfully!");
    } catch (e) {
      showMsg("Failed to create backup.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      setIsRestoring(true);
      const result = await restoreFromBackup(event.target.result);
      if (result.success) {
        showMsg(`Restore complete: ${result.importedCount} imported, ${result.updatedCount} updated.`);
        setProfile(getSettings('companyProfile') || {});
        setDefaults(getSettings('quotationDefaults') || {});
      } else {
        showMsg(`Restore failed: ${result.error}`, "error");
      }
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '100px' }}>
      
      <div>
        <h1 className="text-h1" style={{ margin: '0 0 4px 0' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', margin: 0 }}>
          Manage your application preferences and data.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '16px', borderRadius: 'var(--radius-md)', 
          display: 'flex', alignItems: 'center', gap: '12px',
          backgroundColor: message.type === 'error' ? 'var(--color-error-bg)' : '#F0FDF4',
          color: message.type === 'error' ? 'var(--color-error)' : '#15803d',
          border: `1px solid ${message.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
          boxShadow: 'var(--shadow-sm)'
        }}>
          {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{message.text}</span>
        </div>
      )}

      {/* Modern Tabs */}
      <div style={{ 
        display: 'flex', gap: '8px', overflowX: 'auto', 
        padding: '4px', backgroundColor: 'var(--bg-surface)', 
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {[
          { id: 'profile', icon: Building, label: 'Company' },
          { id: 'branding', icon: ImageIcon, label: 'Branding' },
          { id: 'defaults', icon: FileText, label: 'Defaults' },
          { id: 'system', icon: HardDrive, label: 'System & Data' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
              backgroundColor: activeTab === tab.id ? 'var(--color-orange-50)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-orange-600)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)', fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
              cursor: 'pointer', whiteSpace: 'nowrap', flex: 1, justifyContent: 'center', border: 'none', transition: 'all 0.2s ease'
            }}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* COMPANY PROFILE */}
      {activeTab === 'profile' && (
        <Card className="flex-col gap-6">
          <div>
            <h2 className="text-h2">Company Information</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>This information appears on your quotation documents.</p>
          </div>
          
          <div className="grid-cols-2">
            <Input label="Company Name" value={profile.companyName || ''} onChange={e => setProfile({...profile, companyName: e.target.value})} />
            <Input label="Tagline" value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} />
          </div>
          
          <Input label="Address" value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} />
          
          <div className="grid-cols-2">
            <Input label="Email" type="email" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
            <Input label="Contact Numbers" value={profile.contact || ''} onChange={e => setProfile({...profile, contact: e.target.value})} />
          </div>
          
          <Input label="GST Number" value={profile.gstNumber || ''} onChange={e => setProfile({...profile, gstNumber: e.target.value})} placeholder="Optional" />
          
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => handleSaveGroup('companyProfile', profile)}>
              <Save size={18} /> Save Company Profile
            </Button>
          </div>
        </Card>
      )}

      {/* BRANDING */}
      {activeTab === 'branding' && (
        <Card className="flex-col gap-6">
          <div>
            <h2 className="text-h2">Document Branding</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Upload custom graphics for your PDF exports. Max size: 1MB per image.</p>
          </div>
          
          <div className="flex-col gap-4">
            <div style={{ padding: '20px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)' }}>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block', color: 'var(--text-primary)' }}>Company Logo</label>
              {branding.logoUrl && <img src={branding.logoUrl} alt="Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '16px', backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-default)' }} />}
              <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'logoUrl')} style={{ fontSize: '14px', width: '100%' }} />
            </div>

            <div style={{ padding: '20px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)' }}>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block', color: 'var(--text-primary)' }}>Company Stamp / Seal</label>
              {branding.stampUrl && <img src={branding.stampUrl} alt="Stamp" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px', backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-default)' }} />}
              <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'stampUrl')} style={{ fontSize: '14px', width: '100%' }} />
            </div>

            <div style={{ padding: '20px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)' }}>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block', color: 'var(--text-primary)' }}>Authorized Signature</label>
              {branding.signatureUrl && <img src={branding.signatureUrl} alt="Signature" style={{ height: '60px', objectFit: 'contain', marginBottom: '16px', backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-default)' }} />}
              <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'signatureUrl')} style={{ fontSize: '14px', width: '100%' }} />
            </div>
          </div>
        </Card>
      )}

      {/* DEFAULTS */}
      {activeTab === 'defaults' && (
        <Card className="flex-col gap-6">
          <div>
            <h2 className="text-h2">Quotation Defaults</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Configure the default values loaded into new quotations.</p>
          </div>

          <Textarea 
            label="Default Terms & Conditions" 
            value={defaults.keyTerms || ''} 
            onChange={e => setDefaults({...defaults, keyTerms: e.target.value})} 
            rows={8}
          />
          
          <div className="grid-cols-2">
            <Input 
              label="Default GST (%)" 
              type="number" 
              value={defaults.gstPercentage || ''} 
              onChange={e => setDefaults({...defaults, gstPercentage: e.target.value})} 
            />
            <Input 
              label="Default Validity (Days)" 
              type="number" 
              value={defaults.validityDays || ''} 
              onChange={e => setDefaults({...defaults, validityDays: e.target.value})} 
            />
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '20px', display: 'flex', justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => handleSaveGroup('quotationDefaults', defaults)}>
              <Save size={18} /> Save Defaults
            </Button>
          </div>
        </Card>
      )}

      {/* SYSTEM & BACKUP */}
      {activeTab === 'system' && (
        <div className="flex-col gap-6">
          
          <Card>
            <div className="flex items-center gap-3 mb-4 border-b border-light pb-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ backgroundColor: 'var(--color-orange-100)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <HardDrive size={24} color="var(--color-orange-600)" />
              </div>
              <div>
                <h2 className="text-h2" style={{ margin: 0 }}>Data Backup</h2>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Export your quotations and settings securely.</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Backup Scope</label>
              <div className="flex gap-2">
                <Button variant={backupType === 'full' ? 'primary' : 'outline'} onClick={() => setBackupType('full')} style={{ flex: 1 }}>
                  Full Backup
                </Button>
                <Button variant={backupType === 'date-range' ? 'primary' : 'outline'} onClick={() => setBackupType('date-range')} style={{ flex: 1 }}>
                  Specific Date Range
                </Button>
              </div>
            </div>

            {backupType === 'date-range' && (
              <div className="grid-cols-2" style={{ marginBottom: '20px' }}>
                <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            )}

            <Button variant="primary" className="w-full" onClick={handleExport} disabled={isExporting} style={{ padding: '12px' }}>
              <Download size={18} /> {isExporting ? 'Generating Package...' : 'Export JSON Backup'}
            </Button>
          </Card>

          <Card style={{ backgroundColor: 'var(--bg-input)', borderStyle: 'dashed', borderColor: 'var(--color-grey-400)' }}>
            <div className="flex items-center gap-3 mb-4 border-b border-light pb-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <Upload size={24} color="var(--color-grey-600)" />
              </div>
              <div>
                <h2 className="text-h2" style={{ margin: 0 }}>Data Restore</h2>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Import an AEM JSON backup file.</p>
              </div>
            </div>
            
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleRestoreFile} style={{ display: 'none' }} />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isRestoring} style={{ padding: '12px', backgroundColor: 'white' }}>
              <Upload size={18} /> {isRestoring ? 'Restoring Data securely...' : 'Select Backup File'}
            </Button>
          </Card>
          
        </div>
      )}
      
    </div>
  );
};

export default Settings;
