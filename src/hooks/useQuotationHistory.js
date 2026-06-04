import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuotations, deleteQuotation, saveQuotation } from '../services/quotationService';

/**
 * Custom React Hook to manage the Quotation History feed.
 * Abstracts local DB loading, advanced search filtering, sorting, pagination and CRUD operations.
 */
export const useQuotationHistory = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'draft', 'finalized', 'archived'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setLoading(true);
    const data = await getAllQuotations();
    setQuotations(data || []);
    setLoading(false);
  };

  const removeQuotation = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this quotation? This cannot be undone.")) {
      await deleteQuotation(id);
      await loadQuotations(); 
    }
  };

  const archiveQuotation = async (quote) => {
    if (window.confirm(`Move quotation ${quote.quotationRefNo || 'Draft'} to archive?`)) {
      await saveQuotation({ ...quote, status: 'archived', updatedAt: new Date().toISOString() });
      await loadQuotations();
    }
  };

  const duplicateQuotation = async (originalQuote) => {
    if (window.confirm(`Clone quotation for ${originalQuote.customerDetails.customerName}?`)) {
      const clonedQuote = {
        ...originalQuote,
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

  const openForEdit = (id) => navigate(`/edit/${id}`);
  const openForView = (id) => navigate(`/preview/${id}`);

  // Memoized search filtering and sorting for fast local retrieval
  const processedQuotations = useMemo(() => {
    let result = quotations.filter(q => {
      const term = searchQuery.toLowerCase();
      const name = (q.customerDetails?.customerName || '').toLowerCase();
      const company = (q.customerDetails?.companyName || '').toLowerCase();
      const ref = (q.quotationRefNo || '').toLowerCase();
      const equip = (q.jobDetails?.equipmentType || '').toLowerCase();
      const dateStr = new Date(q.createdAt).toLocaleDateString().toLowerCase();
      
      // Multi-field search mapping
      const matchesSearch = name.includes(term) || company.includes(term) || ref.includes(term) || equip.includes(term) || dateStr.includes(term);
      
      // Status filtering (Hide archived by default unless specifically selected)
      let matchesStatus = false;
      if (filterStatus === 'all') {
        matchesStatus = q.status !== 'archived'; // Hide archived from main feed
      } else {
        matchesStatus = q.status === filterStatus;
      }
      
      return matchesSearch && matchesStatus;
    });

    // Sorting Engine
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amount-desc') return (b.pricingBreakdown?.grandTotal || 0) - (a.pricingBreakdown?.grandTotal || 0);
      if (sortBy === 'amount-asc') return (a.pricingBreakdown?.grandTotal || 0) - (b.pricingBreakdown?.grandTotal || 0);
      return 0;
    });

    return result;
  }, [quotations, searchQuery, filterStatus, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy]);

  const totalPages = Math.ceil(processedQuotations.length / itemsPerPage) || 1;
  const paginatedQuotations = processedQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    loading,
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    sortBy, setSortBy,
    currentPage, setCurrentPage, totalPages,
    paginatedQuotations, totalResults: processedQuotations.length,
    loadQuotations,
    removeQuotation,
    archiveQuotation,
    duplicateQuotation,
    openForEdit,
    openForView
  };
};
