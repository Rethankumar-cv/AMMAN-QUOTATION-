import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Edit2, Copy, Trash2, Plus, Archive, ArrowDownToLine, ChevronLeft, ChevronRight, FileText, Share2, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useQuotationHistory } from '../hooks/useQuotationHistory';
import { useChallanHistory } from '../hooks/useChallanHistory';
import { useSearchParams } from 'react-router-dom';

const QuotationHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'quotations';
  
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
    restoreQuotation,
    duplicateQuotation,
    openForEdit,
    openForView,
    openForAction: openQuoteForAction
  } = useQuotationHistory();
  
  const {
    loading: challanLoading,
    searchQuery: challanQuery, setSearchQuery: setChallanQuery,
    filterStatus: challanFilter, setFilterStatus: setChallanFilter,
    sortBy: challanSort, setSortBy: setChallanSort,
    currentPage: challanPage, setCurrentPage: setChallanPage, totalPages: challanTotalPages,
    paginatedChallans, totalResults: challanTotalResults,
    removeChallan,
    archiveItem: archiveChallan,
    restoreItem: restoreChallan,
    duplicateItem: duplicateChallanItem,
    openForEdit: openChallanForEdit,
    openForView: openChallanForView,
    openForAction: openChallanForAction
  } = useChallanHistory();

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };
  
  const isQuoteTab = currentTab === 'quotations';

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '100px' }}>
      
      {/* Header & Quick Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h1" style={{ margin: '0 0 4px 0' }}>{isQuoteTab ? 'Quotation History' : 'Delivery Challans'}</h1>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Managing {isQuoteTab ? totalResults : challanTotalResults} {isQuoteTab ? (totalResults === 1 ? 'record' : 'records') : (challanTotalResults === 1 ? 'record' : 'records')}
          </span>
        </div>
        <Button variant="primary" onClick={() => navigate(isQuoteTab ? '/create' : '/create-challan')} style={{ display: 'none' }} className="sm:inline-flex">
          <Plus size={16} /> New {isQuoteTab ? 'Quote' : 'Challan'}
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', marginBottom: '8px' }}>
        <button 
          onClick={() => handleTabChange('quotations')}
          style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: isQuoteTab ? '2px solid var(--color-orange-500)' : '2px solid transparent', color: isQuoteTab ? 'var(--color-orange-600)' : 'var(--text-secondary)', fontWeight: isQuoteTab ? 'bold' : 'normal', cursor: 'pointer', fontSize: 'var(--font-size-md)' }}
        >
          Quotations
        </button>
        <button 
          onClick={() => handleTabChange('challans')}
          style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: !isQuoteTab ? '2px solid var(--color-orange-500)' : '2px solid transparent', color: !isQuoteTab ? 'var(--color-orange-600)' : 'var(--text-secondary)', fontWeight: !isQuoteTab ? 'bold' : 'normal', cursor: 'pointer', fontSize: 'var(--font-size-md)' }}
        >
          Delivery Challans
        </button>
      </div>
      
      {/* Advanced Search & Filter Bar */}
      <Card style={{ padding: '16px', marginBottom: '0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex gap-3">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '10px 16px', backgroundColor: 'var(--bg-input)', transition: 'border-color 0.2s ease' }} className="search-container">
            <Search size={18} color="var(--color-grey-500)" style={{ marginRight: '12px', minWidth: '18px' }} />
            <input 
              type="text" 
              placeholder={isQuoteTab ? "Search quotes..." : "Search challans..."} 
              value={isQuoteTab ? searchQuery : challanQuery}
              onChange={(e) => isQuoteTab ? setSearchQuery(e.target.value) : setChallanQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: 'var(--font-size-md)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}
            />
          </div>
          <Button variant={showFilters ? 'primary' : 'outline'} onClick={() => setShowFilters(!showFilters)} style={{ padding: '0 16px', height: 'auto' }}>
            <Filter size={20} />
          </Button>
        </div>

        {/* Expandable Quick Filters & Sorting */}
        {showFilters && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-default)' }}>
            <div className="grid-cols-2">
              <div className="flex-col gap-2">
                <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>FILTER BY STATUS</label>
                <div className="flex gap-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`.flex.gap-2::-webkit-scrollbar { display: none; }`}</style>
                  {['all', 'draft', 'finalized', 'archived'].map(status => {
                    const activeFilter = isQuoteTab ? filterStatus : challanFilter;
                    const setFilter = isQuoteTab ? setFilterStatus : setChallanFilter;
                    return (
                      <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{ 
                          padding: '6px 12px', borderRadius: '20px', fontSize: 'var(--font-size-sm)', cursor: 'pointer', border: '1px solid',
                          backgroundColor: activeFilter === status ? 'var(--color-orange-500)' : 'transparent',
                          color: activeFilter === status ? 'white' : 'var(--text-secondary)',
                          borderColor: activeFilter === status ? 'var(--color-orange-500)' : 'var(--border-default)',
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                      >
                        {status === 'all' ? 'Active Only' : status}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex-col gap-2">
                <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>SORT BY</label>
                <select 
                  value={isQuoteTab ? sortBy : challanSort} 
                  onChange={(e) => isQuoteTab ? setSortBy(e.target.value) : setChallanSort(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--font-size-sm)', backgroundColor: 'var(--bg-input)', outline: 'none' }}>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="amount-asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Empty State */}
      {(!(isQuoteTab ? loading : challanLoading)) && (isQuoteTab ? paginatedQuotations : paginatedChallans).length === 0 && (
        <Card style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-default)' }}>
          <div style={{ backgroundColor: 'white', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)' }}>
             <FileText size={32} color="var(--color-grey-400)" />
          </div>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No Documents Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '300px', margin: '0 auto 24px' }}>
            {(isQuoteTab ? searchQuery : challanQuery) ? "We couldn't find anything matching your search." : `Your archive is currently empty. Generate a ${isQuoteTab ? 'quote' : 'challan'} to see it here.`}
          </p>
          {!(isQuoteTab ? searchQuery : challanQuery) && (
            <Button variant="primary" onClick={() => navigate(isQuoteTab ? '/create' : '/create-challan')}>Create First {isQuoteTab ? 'Quotation' : 'Challan'}</Button>
          )}
        </Card>
      )}

      {/* Dynamic List */}
      <div className="flex-col gap-4">
        {(isQuoteTab ? paginatedQuotations : paginatedChallans).map(q => (
          <Card key={q.id} style={{ padding: '0', opacity: q.status === 'archived' ? 0.7 : 1, overflow: 'hidden' }}>
            <div style={{ padding: '20px' }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)', letterSpacing: '-0.5px' }}>
                      {isQuoteTab ? (q.quotationRefNo || 'Unassigned Draft') : (q.dcNo || 'Unassigned Draft')}
                    </span>
                    <Badge status={q.status} />
                  </div>
                  <div style={{ fontSize: 'var(--font-size-md)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {isQuoteTab ? (q.customerDetails?.companyName || q.customerDetails?.customerName) : (q.billTo?.name || 'Unknown')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-orange-600)', fontSize: 'var(--font-size-xl)' }}>
                    ₹{((isQuoteTab ? q.pricingBreakdown?.grandTotal : q.pricing?.grandTotal) || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span className="flex items-center gap-1"><FileText size={14}/> {isQuoteTab ? q.jobDetails?.equipmentType : q.vehicleNo || 'No Vehicle'}</span>
                <span>&bull;</span>
                <span>{new Date(q.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {q.status === 'draft' && (
                  <Button variant="outline" style={{ padding: '6px 12px', backgroundColor: 'white' }} onClick={() => isQuoteTab ? openForEdit(q.id) : openChallanForEdit(q.id)}>
                    <Edit2 size={16} /> Edit
                  </Button>
                )}
                
                <Button variant="outline" style={{ padding: '6px 12px', backgroundColor: 'white' }} onClick={() => isQuoteTab ? openForView(q.id) : openChallanForView(q.id)} title="Preview">
                  <Eye size={16} /> <span className="hidden sm:inline" style={{marginLeft:'4px'}}>Preview</span>
                </Button>
                
                <Button variant="outline" style={{ padding: '6px 12px', backgroundColor: 'white' }} onClick={() => isQuoteTab ? openQuoteForAction(q.id, 'download') : openChallanForAction(q.id, 'download')} title="Download PDF">
                  <Download size={16} /> <span className="hidden sm:inline" style={{marginLeft:'4px'}}>Download</span>
                </Button>
                
                <Button variant="outline" style={{ padding: '6px 12px', backgroundColor: 'white' }} onClick={() => isQuoteTab ? openQuoteForAction(q.id, 'share') : openChallanForAction(q.id, 'share')} title="Share">
                  <Share2 size={16} /> <span className="hidden sm:inline" style={{marginLeft:'4px'}}>Share</span>
                </Button>
                <Button variant="text" onClick={() => isQuoteTab ? duplicateQuotation(q) : duplicateChallanItem(q)} title="Duplicate">
                  <Copy size={16} />
                </Button>
              </div>

              <div className="flex gap-1">
                {q.status === 'archived' ? (
                  <Button variant="outline" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }} onClick={() => isQuoteTab ? restoreQuotation(q) : restoreChallan(q)} title={`Restore ${isQuoteTab ? 'Quotation' : 'Challan'}`}>
                    Restore
                  </Button>
                ) : (
                  <Button variant="text" onClick={() => isQuoteTab ? archiveQuotation(q) : archiveChallan(q)} title="Archive">
                    <Archive size={16} />
                  </Button>
                )}
                <Button variant="text" style={{ color: 'var(--color-error)' }} onClick={() => isQuoteTab ? removeQuotation(q.id) : removeChallan(q.id)} title="Delete Permanently">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {(isQuoteTab ? totalPages : challanTotalPages) > 1 && (
        <div className="flex items-center justify-between mt-6" style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
          <Button variant="outline" disabled={(isQuoteTab ? currentPage : challanPage) === 1} onClick={() => isQuoteTab ? setCurrentPage(p => p - 1) : setChallanPage(p => p - 1)}>
            <ChevronLeft size={16} /> Prev
          </Button>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
            Page {isQuoteTab ? currentPage : challanPage} of {isQuoteTab ? totalPages : challanTotalPages}
          </span>
          <Button variant="outline" disabled={(isQuoteTab ? currentPage : challanPage) === (isQuoteTab ? totalPages : challanTotalPages)} onClick={() => isQuoteTab ? setCurrentPage(p => p + 1) : setChallanPage(p => p + 1)}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
      
      {/* Mobile FAB */}
      <button 
        onClick={() => navigate(isQuoteTab ? '/create' : '/create-challan')}
        className="sm:hidden"
        style={{ position: 'fixed', bottom: '80px', right: '20px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-orange-500)', color: 'white', border: 'none', boxShadow: '0 4px 16px rgba(243, 146, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90, cursor: 'pointer', transition: 'transform 0.2s' }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default QuotationHistory;
