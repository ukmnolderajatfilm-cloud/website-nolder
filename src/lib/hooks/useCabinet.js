import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

// Custom hook for cabinet data
export function useCabinet() {
  const [cabinet, setCabinet] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCabinet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dataService.getCabinetMembers();
      
      if (response.success) {
        setCabinet(response.cabinet);
        setMembers(response.cabinet?.members || []);
      } else {
        throw new Error(response.message || 'Failed to fetch cabinet data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cabinet data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCabinet();
  }, [fetchCabinet]);

  return { cabinet, members, loading, error, refetch: fetchCabinet };
}
