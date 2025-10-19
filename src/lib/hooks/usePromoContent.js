import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

// Custom hook for promo content
export function usePromoContent() {
  const [promoContent, setPromoContent] = useState([]);
  const [promoCount, setPromoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromoContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dataService.getPromoContent();
      
      if (response.success) {
        const currentMonth = response.monthInfo.currentMonth;
        const currentYear = response.monthInfo.currentYear;
        const monthKey = `${currentYear}-${currentMonth}`;
        
        // Check if we've already shown notification for this month
        const lastShownMonth = localStorage.getItem('nolder-last-shown-month');
        const hasSeenThisMonth = lastShownMonth === monthKey;
        
        setPromoContent(response.contents);
        
        // Only show count if there are contents and user hasn't seen this month's content
        if (response.contents.length > 0 && !hasSeenThisMonth) {
          setPromoCount(response.contents.length);
        } else {
          setPromoCount(0);
        }
      } else {
        throw new Error('Failed to fetch promo content');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching promo content:', err);
      setPromoCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsSeen = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    // Mark this month as seen
    localStorage.setItem('nolder-last-shown-month', monthKey);
    setPromoCount(0); // Hide notification badge
  }, []);

  useEffect(() => {
    fetchPromoContent();
  }, [fetchPromoContent]);

  return { 
    promoContent, 
    promoCount, 
    loading, 
    error, 
    markAsSeen,
    refetch: fetchPromoContent 
  };
}
