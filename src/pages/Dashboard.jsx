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
      <div style={{ padding: '8px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', marginBottom: '8px' }}>
            Today's Overview
          </p>
          <h1 className="text-h1" style={{ margin: 0, fontSize: '28px' }}>Welcome Back, {profile.companyName}</h1>
        </div>
      </div>
      
      {/* Premium Metric Cards */}
      <div className="dashboard-grid">
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Quotes</span>
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px', borderRadius: '10px' }}>
              <FileText size={18} color="var(--color-grey-500)" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>{totalCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 'bold', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               ↑ +12% this month
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Drafts</span>
            <div style={{ backgroundColor: 'var(--color-orange-50)', padding: '8px', borderRadius: '10px' }}>
              <Clock size={18} color="var(--color-orange-500)" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>{draftCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               Awaiting finalization
            </div>
          </div>
        </Card>

        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Finalized</span>
            <div style={{ backgroundColor: '#ECFDF5', padding: '8px', borderRadius: '10px' }}>
              <CheckCircle size={18} color="var(--color-success)" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>{finalizedCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 'bold', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               ↑ +5% this week
            </div>
          </div>
        </Card>

        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', backgroundColor: 'var(--color-grey-900)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Est. Finalized Value</span>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px' }}>
              <TrendingUp size={18} color="var(--color-orange-500)" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ₹{revenueEstimate.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 'bold', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               ↑ Expected revenue
            </div>
          </div>
        </Card>
      </div>

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
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid var(--color-grey-200)', borderTopColor: 'var(--color-orange-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            Loading activity...
          </div>
        ) : recentQuotes.length === 0 ? (
          <Card style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-default)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <FileText size={28} color="var(--color-grey-400)" />
            </div>
            <h3 className="text-h3" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No Recent Activity</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '250px', margin: '0 auto' }}>Your latest finalized quotations will appear here.</p>
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
