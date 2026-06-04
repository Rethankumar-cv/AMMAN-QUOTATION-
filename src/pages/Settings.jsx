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
        // Reload settings
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
    <div className="flex-col gap-4" style={{ paddingBottom: '90px' }}>
      <h1 className="text-h1">Settings</h1>

      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: message.type === 'error' ? 'var(--color-error-bg)' : '#F0FDF4',
          color: message.type === 'error' ? 'var(--color-error)' : '#166534',
          border: `1px solid ${message.type === 'error' ? 'var(--color-error)' : '#22C55E'}`
        }}>
          {message.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)', marginBottom: '16px' }}>
        {[
          { id: 'profile', icon: Building, label: 'Company' },
          { id: 'branding', icon: ImageIcon, label: 'Branding' },
          { id: 'defaults', icon: FileText, label: 'Defaults' },
          { id: 'system', icon: HardDrive, label: 'System' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
              backgroundColor: activeTab === tab.id ? 'var(--color-orange-100)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-orange-600)' : 'var(--text-secondary)',
              border: activeTab === tab.id ? '1px solid var(--color-orange-500)' : '1px solid transparent',
              borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* COMPANY PROFILE */}
      {activeTab === 'profile' && (
        <Card className="flex-col gap-3" style={{ padding: '20px' }}>
          <Input label="Company Name" value={profile.companyName || ''} onChange={e => setProfile({...profile, companyName: e.target.value})} />
          <Input label="Tagline" value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} />
          <Input label="Address" value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} />
          <Input label="Email" type="email" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
          <Input label="Contact Numbers" value={profile.contact || ''} onChange={e => setProfile({...profile, contact: e.target.value})} />
          <Input label="GST Number" value={profile.gstNumber || ''} onChange={e => setProfile({...profile, gstNumber: e.target.value})} placeholder="Optional" />
          <Button variant="primary" onClick={() => handleSaveGroup('companyProfile', profile)} className="mt-2 w-full">
            <Save size={16} style={{marginRight:'8px'}}/> Save Company Profile
          </Button>
        </Card>
      )}

      {/* BRANDING */}
      {activeTab === 'branding' && (
        <Card className="flex-col gap-4" style={{ padding: '20px' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Upload custom graphics for your PDF exports. Max size: 1MB per image.
          </p>
          
          <div style={{ padding: '16px', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Company Logo</label>
            {branding.logoUrl && <img src={branding.logoUrl} alt="Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '12px' }} />}
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'logoUrl')} style={{ fontSize: '12px' }} />
          </div>

          <div style={{ padding: '16px', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Company Stamp / Seal</label>
            {branding.stampUrl && <img src={branding.stampUrl} alt="Stamp" style={{ height: '80px', objectFit: 'contain', marginBottom: '12px' }} />}
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'stampUrl')} style={{ fontSize: '12px' }} />
          </div>

          <div style={{ padding: '16px', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Authorized Signature</label>
            {branding.signatureUrl && <img src={branding.signatureUrl} alt="Signature" style={{ height: '60px', objectFit: 'contain', marginBottom: '12px' }} />}
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'signatureUrl')} style={{ fontSize: '12px' }} />
          </div>
        </Card>
      )}

      {/* DEFAULTS */}
      {activeTab === 'defaults' && (
        <Card className="flex-col gap-4" style={{ padding: '20px' }}>
          <Textarea 
            label="Default Terms & Conditions" 
            value={defaults.keyTerms || ''} 
            onChange={e => setDefaults({...defaults, keyTerms: e.target.value})} 
            rows={8}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Default GST (%)" 
              type="number" 
              value={defaults.gstPercentage || ''} 
              onChange={e => setDefaults({...defaults, gstPercentage: e.target.value})} 
            />
            <Input 
              label="Validity (Days)" 
              type="number" 
              value={defaults.validityDays || ''} 
              onChange={e => setDefaults({...defaults, validityDays: e.target.value})} 
            />
          </div>
          <Button variant="primary" onClick={() => handleSaveGroup('quotationDefaults', defaults)} className="w-full">
            <Save size={16} style={{marginRight:'8px'}}/> Save Defaults
          </Button>
        </Card>
      )}

      {/* SYSTEM & BACKUP */}
      {activeTab === 'system' && (
        <div className="flex-col gap-4">
          <Card style={{ padding: '20px' }}>
            <div className="flex items-center gap-2 mb-4">
              <HardDrive size={20} color="var(--color-orange-500)" />
              <h2 className="text-h2" style={{ margin: 0 }}>Data Backup</h2>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Backup Type</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <Button variant={backupType === 'full' ? 'primary' : 'outline'} onClick={() => setBackupType('full')} style={{ flex: 1, padding: '8px' }}>
                  Full Backup
                </Button>
                <Button variant={backupType === 'date-range' ? 'primary' : 'outline'} onClick={() => setBackupType('date-range')} style={{ flex: 1, padding: '8px' }}>
                  Date Range
                </Button>
              </div>
            </div>

            {backupType === 'date-range' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            )}

            <Button variant="primary" className="w-full" onClick={handleExport} disabled={isExporting}>
              <Download size={18} style={{ marginRight: '8px' }} /> {isExporting ? 'Generating...' : 'Export Backup JSON'}
            </Button>
          </Card>

          <Card style={{ padding: '20px', borderStyle: 'dashed' }}>
            <div className="flex items-center gap-2 mb-4">
              <Upload size={20} color="var(--color-grey-600)" />
              <h2 className="text-h2" style={{ margin: 0 }}>Data Restore</h2>
            </div>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleRestoreFile} style={{ display: 'none' }} />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isRestoring}>
              {isRestoring ? 'Restoring Data...' : 'Import Backup File'}
            </Button>
          </Card>
        </div>
      )}
      
    </div>
  );
};

export default Settings;
