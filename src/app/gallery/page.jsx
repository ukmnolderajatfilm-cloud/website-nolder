'use client';

import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

const TrailerModal = lazy(() => import("../(main)/Components/TrailerModal"));

export default function GalleryPage() {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Film data - expandable with more films
  const films = [
    {
      id: 1,
      title: "TBFSP",
      subtitle: "The Best Film So Far",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2024",
      genre: "Drama",
      description: "Sebuah karya sinematik yang menggambarkan perjalanan hidup dengan perspektif yang mendalam dan penuh makna."
    },
    {
      id: 2,
      title: "CINEMA VERITE",
      subtitle: "Reality Through Lens",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2024",
      genre: "Documentary",
      description: "Eksplorasi mendalam tentang realitas kehidupan melalui lensa kamera sinematik."
    },
    {
      id: 3,
      title: "URBAN SYMPHONY",
      subtitle: "City Life Chronicles",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2023",
      genre: "Drama",
      description: "Simfoni kehidupan perkotaan yang menggambarkan dinamika masyarakat modern."
    },
    {
      id: 4,
      title: "MIDNIGHT STORIES",
      subtitle: "Tales After Dark",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2023",
      genre: "Thriller",
      description: "Kumpulan cerita misterius yang terjadi di tengah malam."
    },
    {
      id: 5,
      title: "GOLDEN HOUR",
      subtitle: "Moments of Truth",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2024",
      genre: "Romance",
      description: "Kisah cinta yang tumbuh dalam momen-momen golden hour yang indah."
    },
    {
      id: 6,
      title: "RETROSPECTIVE",
      subtitle: "Looking Back",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2022",
      genre: "Biography",
      description: "Perjalanan retrospektif kehidupan seorang sineas muda yang penuh inspirasi."
    },
    {
      id: 7,
      title: "FRAME BY FRAME",
      subtitle: "The Art of Cinema",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2024",
      genre: "Documentary",
      description: "Dokumenter tentang proses kreatif dalam pembuatan film frame demi frame."
    },
    {
      id: 8,
      title: "SILENT ECHOES",
      subtitle: "Unspoken Words",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2023",
      genre: "Drama",
      description: "Cerita tentang komunikasi yang terjalin tanpa kata-kata."
    },
    {
      id: 9,
      title: "CAMPUS DIARIES",
      subtitle: "Student Life",
      image: "/Images/poster-film/TBFSP.jpg",
      videoId: "R37-EC48yoc",
      year: "2024",
      genre: "Comedy",
      description: "Kisah lucu dan mengharukan tentang kehidupan mahasiswa di kampus."
    }
  ];

  const handlePosterClick = useCallback((film) => {
    setSelectedFilm(film);
    setIsTrailerModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsTrailerModalOpen(false);
    setSelectedFilm(null);
  }, []);

  const memoizedFilms = useMemo(() => films, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
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
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-6 tracking-wider">
              FILM GALLERY
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
            <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto">
              Koleksi lengkap karya sinematik Nol Derajat Film
            </p>
          </motion.div>
        </div>
      </header>

      {/* Film Grid */}
      <main className="relative z-10 px-8 sm:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
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
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400/20 group-hover:border-yellow-400/40 transition-all duration-500">
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

                  {/* Genre Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-black text-sm font-semibold">{film.genre}</span>
                  </div>
                </div>

                {/* Film Details */}
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {film.title}
                  </h3>
                  <p className="text-lg text-gray-300 mb-3">{film.subtitle}</p>
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

      {/* Background Grain Effect - Optimized */}
      <div className="fixed inset-0 pointer-events-none z-[1] will-change-auto">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.03'%3E%3Ccircle cx='5' cy='5' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
            transform: 'translateZ(0)'
          }} 
        />
      </div>

    </div>
  );
}
