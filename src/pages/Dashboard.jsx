import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import { getAllQuotations } from '../services/quotationService';
import { getSettings } from '../services/settingsService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ companyName: 'Amman Earth Movers' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllQuotations();
        setQuotes(data || []);
        
        const savedProfile = getSettings('companyProfile');
        if (savedProfile) setProfile(savedProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentQuotes = quotes.slice(0, 5);
  const totalCount = quotes.length;
  const draftCount = quotes.filter(q => q.status === 'draft').length;
  const finalizedCount = quotes.filter(q => q.status === 'finalized').length;
  
  // Calculate total finalized revenue (approximate)
  const revenueEstimate = quotes
    .filter(q => q.status === 'finalized')
    .reduce((sum, q) => sum + (Number(q.pricingBreakdown?.grandTotal) || 0), 0);

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '80px' }}>
      
      {/* Hero Welcome */}
      <div style={{ padding: '8px 0 16px 0' }}>
        <h1 className="text-h1" style={{ marginBottom: '8px' }}>Welcome back.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)' }}>
          Here is what's happening at {profile.companyName} today.
        </p>
      </div>
      
      {/* Premium Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--color-grey-300)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <FileText size={16} color="var(--color-grey-500)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Total Quotes</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>{totalCount}</span>
        </Card>
        
        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--color-orange-400)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <Clock size={16} color="var(--color-orange-500)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Drafts</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>{draftCount}</span>
        </Card>

        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--color-success)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <CheckCircle size={16} color="var(--color-success)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>Finalized</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>{finalizedCount}</span>
        </Card>
      </div>

      {/* Revenue Card (Full width on small, part of grid on large) */}
      <Card style={{ padding: '24px', backgroundColor: 'var(--color-grey-900)', color: 'white', border: 'none' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '12px', opacity: 0.8 }}>
          <TrendingUp size={16} color="var(--color-orange-500)" />
          <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.5px' }}>Estimated Finalized Value</span>
        </div>
        <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>₹ {revenueEstimate.toLocaleString('en-IN')}</span>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-h2" style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <Card 
            style={{ padding: '0', display: 'flex', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--color-orange-500)' }} 
            onClick={() => navigate('/create')}
          >
            <div style={{ backgroundColor: 'var(--color-orange-50)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--color-orange-100)' }}>
              <div style={{ backgroundColor: 'var(--color-orange-500)', padding: '12px', borderRadius: '50%', color: 'white' }}>
                <Plus size={24} />
              </div>
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 className="text-h3" style={{ margin: '0 0 4px 0', color: 'var(--color-orange-600)' }}>New Quotation</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>Create a professional estimate</p>
            </div>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', color: 'var(--color-orange-500)' }}>
              <ArrowRight size={20} />
            </div>
          </Card>

          <Card 
            style={{ padding: '0', display: 'flex', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--color-grey-300)' }} 
            onClick={() => navigate('/create-challan')}
          >
            <div style={{ backgroundColor: 'var(--color-grey-50)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--color-grey-200)' }}>
              <div style={{ backgroundColor: 'var(--color-grey-600)', padding: '12px', borderRadius: '50%', color: 'white' }}>
                <FileText size={24} />
              </div>
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 className="text-h3" style={{ margin: '0 0 4px 0', color: 'var(--color-grey-800)' }}>New Delivery Challan</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>Create a dispatch document</p>
            </div>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', color: 'var(--color-grey-500)' }}>
              <ArrowRight size={20} />
            </div>
          </Card>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div style={{ marginTop: '8px' }}>
        <SectionHeader 
          title="Recent Activity" 
          rightElement={<button onClick={() => navigate('/history')} className="btn-text" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>View All Archive</button>} 
        />
        
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading activity...</div>
        ) : recentQuotes.length === 0 ? (
          <Card style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FileText size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p>No quotations generated yet.</p>
          </Card>
        ) : (
          <div className="flex-col gap-3">
            {recentQuotes.map(q => (
              <Card 
                key={q.id} 
                onClick={() => navigate(q.status === 'draft' ? `/edit/${q.id}` : `/preview/${q.id}`)}
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.1s' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-md)', color: 'var(--text-primary)' }}>{q.quotationRefNo || 'WIP Draft'}</span>
                    <Badge status={q.status} />
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {q.customerDetails?.companyName || q.customerDetails?.customerName || 'Unknown Customer'}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-grey-400)' }}>
                    {new Date(q.createdAt).toLocaleDateString('en-IN')} &middot; {q.jobDetails?.equipmentType || 'No Equipment'}
                  </div>
                </div>
                <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)' }}>
                  ₹{(Number(q.pricingBreakdown?.grandTotal) || 0).toLocaleString('en-IN')}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
