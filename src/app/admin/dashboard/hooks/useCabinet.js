import { useState, useEffect } from 'react';

export const useCabinet = () => {
  const [cabinets, setCabinets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all cabinets
  const fetchCabinets = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await fetch('/api/admin/cabinets');
      const data = await response.json();
      
      if (data.success) {
        setCabinets(data.cabinets);
        setError(null); // Clear any previous errors
      } else {
        setError(data.error);
        // If authentication error, redirect to login
        if (response.status === 401) {
          console.log('Authentication required, redirecting to login...');
          window.location.href = '/admin/login';
        }
      }
    } catch (err) {
      console.error('Error fetching cabinets:', err);
      if (err.message === 'Failed to fetch') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to fetch cabinets. Please try again.');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Refresh cabinets without loading state
  const refreshCabinets = async () => {
    await fetchCabinets(false);
  };

  // Create new cabinet
  const createCabinet = async (cabinetData) => {
    try {
      const response = await fetch('/api/admin/cabinets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cabinetData)
      });
      
      const data = await response.json();
      if (data.success) {
        await refreshCabinets(); // Refresh list without loading
        return { success: true, cabinet: data.cabinet };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to create cabinet' };
    }
  };

  // Update cabinet
  const updateCabinet = async (id, cabinetData) => {
    try {
      const response = await fetch(`/api/admin/cabinets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cabinetData)
      });
      
      const data = await response.json();
      if (data.success) {
        await refreshCabinets(); // Refresh list without loading
        return { success: true, cabinet: data.cabinet };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to update cabinet' };
    }
  };

  // Delete cabinet
  const deleteCabinet = async (id) => {
    try {
      const response = await fetch(`/api/admin/cabinets/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        await refreshCabinets(); // Refresh list without loading
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to delete cabinet' };
    }
  };

  // Add member to cabinet
  const addMember = async (cabinetId, memberData) => {
    try {
      const response = await fetch(`/api/admin/cabinets/${cabinetId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      
      const data = await response.json();
      if (data.success) {
        // Force refresh cabinets data without loading state
        await refreshCabinets();
        return { success: true, member: data.member };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error adding member:', err);
      return { success: false, error: 'Failed to add member' };
    }
  };

  // Update member
  const updateMember = async (cabinetId, memberId, memberData) => {
    try {
      const response = await fetch(`/api/admin/cabinets/${cabinetId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      
      const data = await response.json();
      if (data.success) {
        // Force refresh cabinets data without loading state
        await refreshCabinets();
        return { success: true, member: data.member };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error updating member:', err);
      return { success: false, error: 'Failed to update member' };
    }
  };

  // Delete member
  const deleteMember = async (cabinetId, memberId) => {
    try {
      const response = await fetch(`/api/admin/cabinets/${cabinetId}/members/${memberId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        // Force refresh cabinets data without loading state
        await refreshCabinets();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      return { success: false, error: 'Failed to delete member' };
    }
  };

  useEffect(() => {
    fetchCabinets();
  }, []);

  return {
    cabinets,
    isLoading,
    error,
    fetchCabinets,
    refreshCabinets,
    createCabinet,
    updateCabinet,
    deleteCabinet,
    addMember,
    updateMember,
    deleteMember
  };
};

