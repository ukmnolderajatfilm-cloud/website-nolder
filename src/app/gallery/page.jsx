'use client';

import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import DomeGalery from '../(main)/Components/DomeGalery';

const TrailerModal = lazy(() => import("../(main)/Components/TrailerModal"));

export default function GalleryPage() {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFilms();
  }, [fetchFilms]);

  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch films from API
  const fetchFilms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/films?status=all&per_page=50');
      const data = await response.json();
      
      if (data.meta.status === 'success') {
        // Transform API data to match component expectations
        const transformedFilms = data.data.films.map(film => ({
          id: film.id,
          title: film.filmTitle,
          subtitle: film.description ? film.description.substring(0, 50) + '...' : 'Film Description',
          image: film.posterPath || film.posterUrl || '/Images/poster-film/TBFSP.jpg',
          videoId: film.trailerUrl ? extractVideoId(film.trailerUrl) : 'R37-EC48yoc',
          year: new Date(film.releaseDate).getFullYear().toString(),
          genre: film.filmGenre,
          description: film.description || 'No description available.',
          status: film.status
        }));
        setFilms(transformedFilms);
      } else {
        console.error('Error fetching films:', data.meta.message);
        // Fallback to default films if API fails
        setFilms([]);
      }
    } catch (error) {
      console.error('Error fetching films:', error);
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    if (!url) return 'R37-EC48yoc';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : 'R37-EC48yoc';
  };

  const handlePosterClick = useCallback((film) => {
    setSelectedFilm(film);
    setIsTrailerModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsTrailerModalOpen(false);
    setSelectedFilm(null);
  }, []);

  const memoizedFilms = useMemo(() => films, [films]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* DomeGalery Background */}
      <div className="fixed inset-0 z-0">
        <DomeGalery 
          images={[
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'TBFSP' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Cinema Verite' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Urban Symphony' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Midnight Stories' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Golden Hour' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Retrospective' },
            { src: '/Images/poster-film/TBFSP.jpg', alt: 'Frame by Frame' }
          ]}
          fit={0.7}
          minRadius={800}
          maxRadius={1200}
          dragSensitivity={15}
          openedImageWidth="600px"
          openedImageHeight="800px"
          imageBorderRadius="20px"
          openedImageBorderRadius="20px"
          grayscale={true}
          overlayBlurColor="#000000"
        />
      </div>

      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 z-[1]">
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        {/* Center subtle overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-20 pb-16 px-8 sm:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-lg font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4">
              Karya Film
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Koleksi film-film terbaik dari Nolder Film Production
            </p>
          </motion.div>
        </div>
      </header>

      {/* Film Grid */}
      <main className="relative z-10 px-8 sm:px-20 pb-20">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memoizedFilms.map((film, index) => (
              <motion.div
                key={film.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => handlePosterClick(film)}
              >
                {/* Poster Card */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md border border-yellow-400/20 group-hover:border-yellow-400/40 transition-all duration-500 shadow-2xl">
                  {/* Poster Image */}
                  <Image
                    src={film.image}
                    alt={film.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 will-change-transform"
                    loading={index < 3 ? "eager" : "lazy"}
                    priority={index < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-20 h-20 bg-yellow-400/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Film Info Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-yellow-400 text-sm font-semibold">{film.year}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-black text-sm font-semibold">
                      {film.status === 'now_showing' ? 'Now Showing' : 
                       film.status === 'coming_soon' ? 'Coming Soon' : 'Archived'}
                    </span>
                  </div>
                </div>

                {/* Film Details */}
                <div className="mt-6 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-yellow-400/10">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {film.title}
                  </h3>
                  <p className="text-lg text-gray-300 mb-3">{film.subtitle}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                      {film.genre}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {film.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Trailer Modal */}
      <Suspense fallback={null}>
        <TrailerModal 
          isOpen={isTrailerModalOpen} 
          onClose={handleCloseModal}
          videoId={selectedFilm?.videoId || "R37-EC48yoc"}
          title={selectedFilm?.title || "TBFSP"}
          subtitle={selectedFilm?.subtitle || "Official Trailer"}
        />
      </Suspense>

      {/* Background Grain Effect - Removed to not interfere with DomeGalery */}

    </div>
  );
}
