import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import { mockQuotations } from '../utils/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const recentQuotes = mockQuotations.slice(0, 3);
  
  // Mock metrics
  const totalCount = 125;
  const draftCount = 12;

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '80px' }}>
      <h1 className="text-h1">Dashboard</h1>
      
      {/* Quick Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 'var(--space-4)' }}>
        <Card style={{ marginBottom: 0, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'var(--font-weight-medium)' }}>Total Quotes</span>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>{totalCount}</span>
        </Card>
        <Card style={{ marginBottom: 0, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'var(--font-weight-medium)' }}>Drafts</span>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-orange-500)' }}>{draftCount}</span>
        </Card>
      </div>

      {/* Primary CTA */}
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'var(--color-orange-100)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
          <PlusCircle size={32} color="var(--color-orange-500)" />
        </div>
        <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Create New Quotation</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: 'var(--font-size-sm)' }}>
          Generate a professional, branded estimate.
        </p>
        <button className="btn btn-primary w-full" onClick={() => navigate('/create')}>
          Start New Quotation
        </button>
      </Card>
      
      {/* Recent Quotations */}
      <div style={{ marginTop: '24px' }}>
        <SectionHeader 
          title="Recent Activity" 
          rightElement={<button onClick={() => navigate('/history')} className="btn-text" style={{ fontSize: 'var(--font-size-sm)' }}>View All</button>} 
        />
        
        <div className="flex-col gap-2">
          {recentQuotes.map(q => (
            <Card key={q.id} style={{ marginBottom: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{q.quotationRefNo || 'Draft'}</span>
                  <Badge status={q.status}>{q.status}</Badge>
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{q.customerDetails.companyName || q.customerDetails.customerName}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  {new Date(q.createdAt).toLocaleDateString()} &middot; {q.jobDetails.equipmentType}
                </div>
              </div>
              <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                ₹{q.pricingBreakdown.grandTotal.toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
