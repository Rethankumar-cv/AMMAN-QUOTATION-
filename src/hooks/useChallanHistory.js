import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChallans, deleteChallan, updateChallanStatus, duplicateChallan } from '../services/challanService';

export const useChallanHistory = () => {
  const navigate = useNavigate();
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [sortBy, setSortBy] = useState('date-desc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadChallans = async () => {
    setLoading(true);
    try {
      const data = await getAllChallans();
      setChallans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallans();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...challans];

    if (filterStatus === 'all') {
      result = result.filter(q => q.status !== 'archived');
    } else {
      result = result.filter(q => q.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.dcNo?.toLowerCase().includes(q) ||
        item.billTo?.name?.toLowerCase().includes(q) ||
        item.vehicleNo?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const getVal = (item) => Number(item.pricing?.grandTotal) || 0;
      if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amount-desc') return getVal(b) - getVal(a);
      if (sortBy === 'amount-asc') return getVal(a) - getVal(b);
      return 0;
    });

    return result;
  }, [challans, filterStatus, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedChallans = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy]);

  const removeChallan = async (id) => {
    if (window.confirm("Permanently delete this challan? This cannot be undone.")) {
      await deleteChallan(id);
      await loadChallans();
    }
  };

  const archiveItem = async (q) => {
    if (window.confirm("Archive this challan?")) {
      await updateChallanStatus(q.id, 'archived');
      await loadChallans();
    }
  };

  const restoreItem = async (q) => {
    await updateChallanStatus(q.id, 'finalized');
    await loadChallans();
  };

  const duplicateItem = async (q) => {
    if (window.confirm(`Create a copy of ${q.dcNo || 'this challan'}?`)) {
      const cloned = await duplicateChallan(q);
      navigate(`/edit-challan/${cloned.id}`);
    }
  };

  const openForEdit = (id) => navigate(`/edit-challan/${id}`);
  const openForView = (id) => navigate(`/preview-challan/${id}`);
  const openForAction = (id, action) => navigate(`/preview-challan/${id}?autoAction=${action}`);

  return {
    loading,
    searchQuery, setSearchQuery,
    filterStatus, setFilterStatus,
    sortBy, setSortBy,
    currentPage, setCurrentPage, totalPages,
    paginatedChallans, totalResults: filteredAndSorted.length,
    removeChallan,
    archiveItem,
    restoreItem,
    duplicateItem,
    openForEdit,
    openForView,
    openForAction
  };
};
