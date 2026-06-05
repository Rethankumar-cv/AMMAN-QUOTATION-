import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Download, Share2, Printer, RefreshCw, ExternalLink, Edit2, Copy, Archive } from 'lucide-react';
import Button from '../components/common/Button';
import { getQuotationById, saveQuotation } from '../services/quotationService';
import { mapQuotationData } from '../utils/quotationMapper';
import { generateQuotationPDF } from '../services/pdfGenerator';
import { getSettings } from '../services/settingsService';
import QuotationTemplate from '../components/pdf/QuotationTemplate';

const Preview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoAction = searchParams.get('autoAction');

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [scale, setScale] = useState(1);
  
  const printRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      const padding = 32;
      if (window.innerWidth < 794 + padding) {
        setScale((window.innerWidth - padding) / 794);
      } else {
        setScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        let rawData = null;
        if (id === 'draft') {
          const draft = localStorage.getItem('aem_wip_draft');
          if (draft) rawData = JSON.parse(draft);
        } else {
          rawData = await getQuotationById(id);
        }
        
        if (rawData) setData(mapQuotationData(rawData));
        
        // Also fetch profile for header details
        const savedProfile = getSettings('companyProfile') || {
          companyName: 'AMMAN EARTH MOVERS',
          tagline: 'Heavy Earthmoving & Vehicle Solutions',
          address: '60-A, NGR Street, Kalapatti, Coimbatore - 641 048',
          email: 'ammanearthmoverscbe48@gmail.com',
          contact: '9842267585 | 9842867585'
        };
        setProfile(savedProfile);
      } catch (err) {
        console.error("Failed to load quotation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  useEffect(() => {
    if (!loading && data && autoAction && printRef.current) {
      // Ensure the DOM has fully painted before taking snapshot
      const timer = setTimeout(() => {
        if (autoAction === 'download') handleDownload();
        else if (autoAction === 'share') handleShare();
        
        // Remove param to prevent re-triggering
        searchParams.delete('autoAction');
        setSearchParams(searchParams, { replace: true });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, data, autoAction, searchParams, setSearchParams]);

  const showNotification = (msg, isError = false) => {
    setNotification({ msg, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFinalize = async () => {
    if (!data) return;
    const { formatted, ...cleanData } = data;
    const quoteToSave = { ...cleanData, status: 'finalized', updatedAt: new Date().toISOString() };
    await saveQuotation(quoteToSave);
    if (id === 'draft') localStorage.removeItem('aem_wip_draft'); 
    navigate('/history');
  };

  const handleEdit = () => {
    if (id === 'draft') navigate('/create');
    else navigate(`/edit/${id}`);
  };

  const handleArchive = async () => {
    if (window.confirm("Move this quotation to archive?")) {
      const { formatted, ...cleanData } = data;
      const quoteToSave = { ...cleanData, status: 'archived', updatedAt: new Date().toISOString() };
      await saveQuotation(quoteToSave);
      navigate('/history');
    }
  };

  const handleClone = async () => {
    if (window.confirm("Create a copy of this quotation?")) {
      const { formatted, ...cleanData } = data;
      const clonedQuote = {
        ...cleanData,
        id: crypto.randomUUID(),
        quotationRefNo: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await saveQuotation(clonedQuote);
      navigate(`/edit/${clonedQuote.id}`);
    }
  };

  const getSafeFilename = () => {
    const refStr = (data.quotationRefNo || 'Draft').replace(/\//g, '-');
    return `Quotation_${refStr}.pdf`;
  };

  const cachedPdfRef = useRef(null);

  const executeExport = async () => {
    if (cachedPdfRef.current) return cachedPdfRef.current;
    
    setIsExporting(true);
    try {
      if (!printRef.current) throw new Error("DOM not ready");
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

  const handleOpenNewTab = async () => {
    const result = await executeExport();
    if (result) {
      window.open(result.blobUrl, '_blank');
      showNotification("PDF Opened in new tab.");
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
            files: [file],
            title: `Quotation ${data.quotationRefNo || 'Draft'}`,
            text: `Please find the attached quotation from ${profile.companyName || 'Amman Earth Movers'}.`
          });
          showNotification("Shared successfully!");
        } catch (e) {
          if (e.name !== 'AbortError') showNotification("Share failed. Please download instead.", true);
        }
      } else {
        showNotification("Native sharing not supported. Please download.", true);
      }
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading preview...</div>;
  if (!data) return (
    <div className="flex-col gap-4" style={{ padding: '24px', textAlign: 'center' }}>
      <h2 className="text-h2">No data found</h2>
      <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  const { formatted, customerDetails = {}, jobDetails = {}, pricingBreakdown = {}, brandingMetadata = {} } = data;

  // Format currency helper to ensure '0' is shown if empty
  const fmt = (val) => val && Number(val) !== 0 ? Number(val).toLocaleString('en-IN') : '0';

  return (
    <div className="flex-col" style={{ paddingBottom: '160px', minHeight: '100vh', backgroundColor: 'var(--color-grey-100)', margin: 'calc(var(--space-6) * -1) calc(var(--space-4) * -1)', padding: 'var(--space-6) var(--space-4)' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: notification.isError ? 'var(--color-error)' : 'var(--color-grey-900)',
          color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-xl)', zIndex: 9999,
          boxShadow: 'var(--shadow-lg)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }} className="no-print">
          {notification.msg}
        </div>
      )}

      {/* Workspace Header - Mobile Optimized */}
      <div className="flex-col gap-4 no-print" style={{ maxWidth: '794px', margin: '0 auto 24px auto', width: '100%' }}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid var(--border-default)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>&larr;</span>
            </button>
            <div>
              <h1 className="text-h1" style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Document Preview</h1>
              <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-bold)' }}>{data.quotationRefNo || 'WIP Draft'}</span>
                <span style={{ 
                  fontSize: '10px', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 'bold',
                  backgroundColor: data.status === 'finalized' ? '#DCFCE7' : data.status === 'archived' ? '#F3F4F6' : '#FEF3C7',
                  color: data.status === 'finalized' ? '#166534' : data.status === 'archived' ? '#4B5563' : '#92400E'
                }}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Responsive Action Buttons */}
        <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.flex.gap-2::-webkit-scrollbar { display: none; }`}</style>
          
          <Button variant="outline" onClick={handleEdit} style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>
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

      {/* A4 Document Container - Target for Visual Preview Only */}
      <div style={{ paddingBottom: '32px', display: 'flex', justifyContent: 'center' }} className="no-print preview-container">
        <div style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: '794px',
          transition: 'transform 0.2s ease-in-out',
          height: scale < 1 ? `calc(1123px * ${scale})` : 'auto',
          marginBottom: scale < 1 ? '0' : '40px'
        }}>
          {/* VISUAL PREVIEW: No ref attached here. We don't export this one. */}
          <QuotationTemplate data={data} profile={profile} />
        </div>
      </div>

      {/* OFF-SCREEN STRICT EXPORT TEMPLATE - Target for PDF Engine */}
      <div style={{ 
        position: 'absolute', 
        top: '-9999px', 
        left: '-9999px', 
        width: '794px', 
        zIndex: -1000, 
        pointerEvents: 'none' 
      }}>
        {/* EXPORT TARGET: Unscaled, untouched by viewport rules */}
        <QuotationTemplate ref={printRef} data={data} profile={profile} />
      </div>
      
      {/* Sticky Bottom Premium Action Area - ONLY for Drafts */}
      {data.status === 'draft' && (
        <div className="no-print" style={{ 
          position: 'fixed', bottom: '64px', left: 0, right: 0, 
          padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
          backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', 
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.08)', zIndex: 90 
        }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button variant="primary" className="w-full" onClick={handleFinalize} style={{ padding: '12px', fontSize: 'var(--font-size-md)', boxShadow: '0 4px 14px rgba(243, 146, 0, 0.4)' }}>
              Confirm & Save Final Quotation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
