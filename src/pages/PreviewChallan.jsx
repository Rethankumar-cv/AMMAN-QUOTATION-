import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Download, Share2, Printer, RefreshCw, ExternalLink, Edit2, Copy, Archive } from 'lucide-react';
import Button from '../components/common/Button';
import { getChallanById, saveChallan, updateChallanStatus, duplicateChallan, deleteChallan } from '../services/challanService';
import { generateQuotationPDF } from '../services/pdfGenerator';
import { getSettings } from '../services/settingsService';
import ChallanTemplate from '../components/pdf/ChallanTemplate';

const PreviewChallan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const autoAction = searchParams.get('autoAction');

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [notification, setNotification] = useState(null);

  const printRef = useRef(null);
  const cachedPdfRef = useRef(null);

  const showNotification = (msg, isError = false) => {
    setNotification({ msg, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 820) {
        setScale((screenWidth - 40) / 794);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        let challanData = null;
        if (id === 'draft') {
          const draft = localStorage.getItem('aem_wip_challan');
          if (draft) challanData = JSON.parse(draft);
        } else {
          challanData = await getChallanById(id);
          const editDraft = localStorage.getItem(`aem_edit_challan_${id}`);
          if (editDraft) {
            const parsed = JSON.parse(editDraft);
            if (new Date(parsed.updatedAt) >= new Date(challanData.updatedAt)) {
              challanData = parsed;
            }
          }
        }

        if (challanData) {
          setData(challanData);
          const settings = await getSettings();
          setProfile(settings?.profile || {});
        } else {
          navigate('/history?tab=challans');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && data && autoAction === 'share') {
      setTimeout(() => handleShare(), 500);
    }
  }, [loading, data, autoAction]);

  const handleFinalize = async () => {
    try {
      const finalData = {
        ...data,
        status: 'finalized',
        updatedAt: new Date().toISOString()
      };
      await saveChallan(finalData);
      if (id === 'draft') localStorage.removeItem('aem_wip_challan');
      else localStorage.removeItem(`aem_edit_challan_${id}`);
      
      setData(finalData);
      navigate(`/preview-challan/${finalData.id}`, { replace: true });
      showNotification("Delivery Challan finalized and locked.");
    } catch (e) {
      console.error(e);
      showNotification("Failed to finalize challan.", true);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-challan/${data.id}`);
  };

  const handleArchive = async () => {
    if (window.confirm("Archive this challan? It will be removed from main views.")) {
      await updateChallanStatus(data.id, 'archived');
      navigate('/history?tab=challans');
    }
  };

  const handleClone = async () => {
    if (window.confirm("Create a copy of this challan?")) {
      const cloned = await duplicateChallan(data);
      navigate(`/edit-challan/${cloned.id}`);
    }
  };

  const getSafeFilename = () => {
    const refStr = (data.dcNo || 'Draft').replace(/\//g, '-');
    return `Challan_${refStr}.pdf`;
  };

  const executeExport = async () => {
    if (cachedPdfRef.current) return cachedPdfRef.current;
    
    setIsExporting(true);
    try {
      if (!printRef.current) throw new Error("DOM not ready");
      // generateQuotationPDF uses html2canvas/jsPDF, perfectly reusable for any A4 layout
      const pdf = await generateQuotationPDF(printRef.current);
      const result = { pdf, blob: pdf.output('blob'), blobUrl: pdf.output('bloburl') };
      cachedPdfRef.current = result;
      return result;
    } catch (e) {
      console.error(e);
      showNotification("Failed to generate PDF.", true);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    const result = await executeExport();
    if (result) {
      result.pdf.save(getSafeFilename());
      showNotification("PDF Downloaded Successfully!");
    }
  };

  const handlePrint = async () => {
    const result = await executeExport();
    if (result) {
      const printWindow = window.open(result.blobUrl);
      if (!printWindow) showNotification("Please allow popups to print.", true);
    }
  };

  const handleShare = async () => {
    const result = await executeExport();
    if (result) {
      const file = new File([result.blob], getSafeFilename(), { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Delivery Challan ${data.dcNo}`,
            text: `Please find attached Delivery Challan from ${profile.companyName || 'AMMAN EARTH MOVERS'}.`,
            files: [file]
          });
          showNotification("Shared successfully!");
        } catch (e) {
          if (e.name !== 'AbortError') showNotification("Failed to share file.", true);
        }
      } else {
        showNotification("Native sharing not supported. Please download.", true);
      }
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading preview...</div>;
  if (!data) return null;

  return (
    <div className="flex-col" style={{ paddingBottom: '160px', minHeight: '100vh', backgroundColor: 'var(--color-grey-100)', margin: 'calc(var(--space-6) * -1) calc(var(--space-4) * -1)', padding: 'var(--space-6) var(--space-4)' }}>
      {notification && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: notification.isError ? 'var(--color-error)' : 'var(--color-success)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-full)', zIndex: 1000, boxShadow: 'var(--shadow-md)', fontWeight: '500', fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap' }}>
          {notification.msg}
        </div>
      )}

      {/* Header Actions */}
      <div className="no-print" style={{ backgroundColor: 'white', margin: '-var(--space-6) -var(--space-4) var(--space-6)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid var(--border-default)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{data.dcNo || 'Draft Challan'}</span>
            <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 'bold', borderRadius: '12px', textTransform: 'uppercase', backgroundColor: data.status === 'draft' ? 'var(--color-orange-50)' : 'rgba(16, 185, 129, 0.1)', color: data.status === 'draft' ? 'var(--color-orange-600)' : 'var(--color-success)' }}>
              {data.status === 'draft' ? 'DRAFT' : 'FINAL'}
            </span>
          </div>
          <button onClick={() => navigate('/history?tab=challans')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
            Close
          </button>
        </div>

        <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px', scrollbarWidth: 'none' }} className="hide-scrollbar">
          <Button variant="outline" onClick={handleEdit} disabled={isExporting} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Edit2 size={14} style={{ marginRight: '6px' }} /> Edit
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={isExporting} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {isExporting ? <RefreshCw size={14} className="spin" style={{marginRight:'6px'}}/> : <Download size={14} style={{ marginRight: '6px' }} />} Download
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={isExporting} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Printer size={14} style={{ marginRight: '6px' }} /> Print
          </Button>
          <Button variant="outline" onClick={handleShare} disabled={isExporting} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Share2 size={14} style={{ marginRight: '6px' }} /> Share
          </Button>
          {id !== 'draft' && (
            <>
              <Button variant="outline" onClick={handleClone} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Copy size={14} style={{ marginRight: '6px' }} /> Clone
              </Button>
              <Button variant="outline" onClick={handleArchive} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Archive size={14} style={{ marginRight: '6px' }} /> Archive
              </Button>
            </>
          )}
        </div>
      </div>

      <div style={{ paddingBottom: '32px', display: 'flex', justifyContent: 'center' }} className="no-print preview-container">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '794px', transition: 'transform 0.2s ease-in-out', height: scale < 1 ? `calc(1123px * ${scale})` : 'auto', marginBottom: scale < 1 ? '0' : '40px' }}>
          <ChallanTemplate data={data} profile={profile} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '794px', zIndex: -1000, pointerEvents: 'none' }}>
        <ChallanTemplate ref={printRef} data={data} profile={profile} />
      </div>
      
      {data.status === 'draft' && (
        <div className="no-print" style={{ position: 'fixed', bottom: '64px', left: 0, right: 0, padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.08)', zIndex: 90 }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button variant="primary" className="w-full" onClick={handleFinalize} style={{ padding: '12px', fontSize: 'var(--font-size-md)', boxShadow: '0 4px 14px rgba(243, 146, 0, 0.4)' }}>
              Confirm & Save Final Challan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewChallan;
