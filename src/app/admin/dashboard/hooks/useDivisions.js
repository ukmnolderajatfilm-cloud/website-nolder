import { useState, useEffect } from 'react';

export const useDivisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all divisions
  const fetchDivisions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/divisions');
      const data = await response.json();
      
      if (data.success) {
        setDivisions(data.divisions);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch divisions');
      console.error('Error fetching divisions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new division
  const createDivision = async (divisionData) => {
    try {
      const response = await fetch('/api/admin/divisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(divisionData)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchDivisions(); // Refresh list
        return { success: true, division: data.division };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to create division' };
    }
  };

  // Update division
  const updateDivision = async (id, divisionData) => {
    try {
      const response = await fetch(`/api/admin/divisions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(divisionData)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchDivisions(); // Refresh list
        return { success: true, division: data.division };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to update division' };
    }
  };

  // Delete division
  const deleteDivision = async (id) => {
    try {
      const response = await fetch(`/api/admin/divisions/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchDivisions(); // Refresh list
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to delete division' };
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  return {
    divisions,
    isLoading,
    error,
    fetchDivisions,
    createDivision,
    updateDivision,
    deleteDivision
  };
};

