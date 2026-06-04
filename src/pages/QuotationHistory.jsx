import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit2, Copy, Trash2, Plus, Archive, ArrowDownToLine, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useQuotationHistory } from '../hooks/useQuotationHistory';

const QuotationHistory = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    loading,
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    sortBy, setSortBy,
    currentPage, setCurrentPage, totalPages,
    paginatedQuotations, totalResults,
    removeQuotation,
    archiveQuotation,
    duplicateQuotation,
    openForEdit,
    openForView
  } = useQuotationHistory();
  
  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '90px' }}>
      
      {/* Header & Quick Stats */}
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-h1" style={{ margin: 0 }}>Quotations</h1>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {totalResults} {totalResults === 1 ? 'Record' : 'Records'}
        </span>
      </div>
      
      {/* Advanced Search Bar */}
      <div className="flex gap-2 mb-2">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-md)', padding: '10px 14px', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}>
          <Search size={18} color="var(--color-orange-500)" style={{ marginRight: '8px', minWidth: '18px' }} />
          <input 
            type="text" 
            placeholder="Search Ref, Client, Vehicle, Date..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 'var(--font-size-md)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}
          />
        </div>
        <Button variant={showFilters ? 'primary' : 'outline'} onClick={() => setShowFilters(!showFilters)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <Filter size={20} color={showFilters ? 'white' : 'var(--text-secondary)'} />
        </Button>
      </div>

      {/* Expandable Quick Filters & Sorting */}
      {showFilters && (
        <Card style={{ backgroundColor: 'var(--color-orange-100)', border: '1px solid var(--color-orange-500)', marginBottom: '16px', padding: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
            <div className="flex-col gap-1">
              <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>STATUS</label>
              <select 
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-default)', fontSize: 'var(--font-size-sm)' }}>
                <option value="all">Active Only</option>
                <option value="draft">Drafts</option>
                <option value="finalized">Finalized</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex-col gap-1">
              <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>SORT BY</label>
              <select 
                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-default)', fontSize: 'var(--font-size-sm)' }}>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && paginatedQuotations.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed' }}>
          <div style={{ backgroundColor: 'var(--color-grey-100)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
             <Search size={32} color="var(--color-grey-500)" />
          </div>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>No Quotations Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Try adjusting your search criteria or create a new one.</p>
          <Button variant="primary" onClick={() => navigate('/create')}>Create Quotation</Button>
        </Card>
      )}

      {/* Dynamic List */}
      <div className="flex-col gap-3">
        {paginatedQuotations.map(q => (
          <Card key={q.id} style={{ padding: '16px', opacity: q.status === 'archived' ? 0.7 : 1 }}>
            
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2" style={{ maxWidth: '65%' }}>
                <span className="text-truncate" style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }}>
                  {q.quotationRefNo || 'Unassigned Draft'}
                </span>
                <Badge status={q.status}>{q.status}</Badge>
              </div>
              <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-orange-600)', fontSize: 'var(--font-size-lg)' }}>
                ₹{(q.pricingBreakdown?.grandTotal || 0).toLocaleString()}
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              <div className="text-truncate"><strong style={{color: 'var(--text-primary)'}}>{q.customerDetails.customerName}</strong> {q.customerDetails.companyName && `(${q.customerDetails.companyName})`}</div>
              <div className="text-truncate">{q.jobDetails.equipmentType} &middot; Created: {new Date(q.createdAt).toLocaleDateString()}</div>
            </div>

            {/* Comprehensive Action Buttons */}
            <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
              
              <div className="flex gap-2">
                {q.status === 'draft' ? (
                  <Button variant="outline" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }} onClick={() => openForEdit(q.id)}>
                    <Edit2 size={14} style={{ marginRight: '4px' }}/> Edit
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }} onClick={() => openForView(q.id)}>
                      <Eye size={14} style={{ marginRight: '4px' }}/> View
                    </Button>
                    <Button variant="outline" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }} onClick={() => openForView(q.id)}>
                      <ArrowDownToLine size={14} style={{ marginRight: '4px' }}/> PDF
                    </Button>
                  </>
                )}
                
                <Button variant="outline" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }} onClick={() => duplicateQuotation(q)}>
                  <Copy size={14} style={{ marginRight: '4px' }}/> Clone
                </Button>
              </div>

              {/* Danger Zone Actions */}
              <div className="flex gap-1">
                {q.status !== 'archived' && (
                  <Button variant="text" style={{ padding: '6px', color: 'var(--color-grey-500)' }} onClick={() => archiveQuotation(q)} title="Archive">
                    <Archive size={18} />
                  </Button>
                )}
                <Button variant="text" style={{ padding: '6px', color: 'var(--color-error)' }} onClick={() => removeQuotation(q.id)} title="Delete Permanently">
                  <Trash2 size={18} />
                </Button>
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4" style={{ backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <Button variant="outline" style={{ padding: '6px 12px' }} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft size={16} /> Prev
          </Button>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" style={{ padding: '6px 12px' }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
      
      {/* Floating Action Button for mobile quick-add */}
      <button 
        onClick={() => navigate('/create')}
        style={{ position: 'fixed', bottom: '80px', right: '16px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-orange-500)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(243, 146, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90, cursor: 'pointer' }}>
        <Plus size={24} />
      </button>
    </div>
  );
};

export default QuotationHistory;
