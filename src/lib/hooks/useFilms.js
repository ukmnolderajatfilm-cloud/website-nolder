import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

// Custom hook for films data
export function useFilms(options = {}) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dataService.getFilms(options);
      
      if (response.meta?.status === 'success') {
        // Filter films with valid posters only (exclude any hardcoded placeholders)
        const filmsWithPosters = response.data.films.filter(film => 
          (film.posterPath || film.posterUrl) && 
          (film.posterPath || film.posterUrl).trim() !== '' &&
          !(film.posterPath || film.posterUrl).includes('TBFSP') &&
          !(film.posterPath || film.posterUrl).includes('/Images/poster-film/')
        );
        
        setFilms(filmsWithPosters);
      } else {
        throw new Error(response.meta?.message || 'Failed to fetch films');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching films:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  return { films, loading, error, refetch: fetchFilms };
}

// Custom hook for featured films
export function useFeaturedFilms(limit = 6) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedFilms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dataService.getFeaturedFilms(limit);
      
      if (response.meta?.status === 'success') {
        const transformedFilms = response.data.films
          .map(film => ({
            image: film.posterPath || film.posterUrl,
            text: film.filmTitle,
            id: film.id,
            trailerUrl: film.trailerUrl
          }))
          .filter(film => film.image); // Only include films with valid posters
        
        setFilms(transformedFilms);
      } else {
        throw new Error(response.meta?.message || 'Failed to fetch featured films');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching featured films:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedFilms();
  }, [fetchFeaturedFilms]);

  return { films, loading, error, refetch: fetchFeaturedFilms };
}

// Custom hook for daily random films
export function useDailyRandomFilms() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDailyRandomFilms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎬 Fetching daily random films from database...');
      const response = await dataService.getFilms({ status: 'all', per_page: 50 });
      
      if (response.meta?.status === 'success' && response.data.films.length > 0) {
        console.log(`📊 Total films in database: ${response.data.films.length}`);
        
        // Better randomization using date-based seeding
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Filter films with valid posters only (exclude any hardcoded placeholders)
        const filmsWithPosters = response.data.films.filter(film => 
          (film.posterPath || film.posterUrl) && 
          (film.posterPath || film.posterUrl).trim() !== '' &&
          !(film.posterPath || film.posterUrl).includes('TBFSP') &&
          !(film.posterPath || film.posterUrl).includes('/Images/poster-film/')
        );
        
        console.log(`🖼️ Films with unique posters: ${filmsWithPosters.length}`);
        
        // Use films with posters if available, otherwise use all films
        const filmsToShuffle = filmsWithPosters.length >= 6 ? filmsWithPosters : response.data.films;
        
        // Fisher-Yates shuffle with seeded random
        const shuffled = [...filmsToShuffle];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor((seed + i * 7) % (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Ensure we get unique films (no duplicates)
        const uniqueFilms = [];
        const usedIds = new Set();
        const usedPosters = new Set();
        
        for (const film of shuffled) {
          const poster = film.posterPath || film.posterUrl;
          if (poster && !usedIds.has(film.id) && !usedPosters.has(poster) && uniqueFilms.length < 6) {
            uniqueFilms.push({
              id: film.id,
              title: film.filmTitle,
              poster: poster,
              trailerUrl: film.trailerUrl
            });
            usedIds.add(film.id);
            usedPosters.add(poster);
          }
        }
        
        // Log detailed info for debugging
        console.log('✅ Daily random films loaded (seed:', seed, '):');
        uniqueFilms.forEach((film, index) => {
          console.log(`  Card ${index}: "${film.title}" - Poster: ${film.poster}`);
        });
        
        setFilms(uniqueFilms);
      } else {
        // Fallback to dynamic films with random posters from uploads
        console.log('⚠️ No films in database, using dynamic fallback films');
        const availablePosters = await dataService.getAvailablePosters();
        const filmTitles = [
          'The Big Fish in Small Pond',
          'Yth. (Yang Terhormat)', 
          'Nol Derajat Production',
          'Cinematic Journey',
          'Film Showcase',
          'Creative Vision'
        ];
        
        const fallbackFilms = availablePosters.map((poster, index) => ({
          id: index + 1,
          title: filmTitles[index] || `Film ${index + 1}`,
          poster: poster,
          trailerUrl: null
        }));
        
        console.log('📋 Dynamic fallback films loaded:');
        fallbackFilms.forEach((film, index) => {
          console.log(`  Card ${index}: "${film.title}" - Poster: ${film.poster}`);
        });
        
        setFilms(fallbackFilms);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching daily random films:', err);
      
      // Fallback to dynamic films with random posters from uploads
      try {
        const availablePosters = await dataService.getAvailablePosters();
        const filmTitles = [
          'The Big Fish in Small Pond',
          'Yth. (Yang Terhormat)', 
          'Nol Derajat Production',
          'Cinematic Journey',
          'Film Showcase',
          'Creative Vision'
        ];
        
        const errorFallbackFilms = availablePosters.map((poster, index) => ({
          id: index + 1,
          title: filmTitles[index] || `Film ${index + 1}`,
          poster: poster,
          trailerUrl: null
        }));
        
        console.log('🚨 Dynamic error fallback films loaded:');
        errorFallbackFilms.forEach((film, index) => {
          console.log(`  Card ${index}: "${film.title}" - Poster: ${film.poster}`);
        });
        
        setFilms(errorFallbackFilms);
      } catch (fallbackErr) {
        console.error('❌ Error in fallback films:', fallbackErr);
        setFilms([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { films, loading, error, refetch: getDailyRandomFilms };
}
