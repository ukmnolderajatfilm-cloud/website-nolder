'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
// import Lenis from 'lenis'; // Disabled for better performance
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Navbar from "./Layouts/Navbar";
import AboutBentoLayout from "./Layouts/AboutBentoLayout";
import Hero from "./Components/Hero";
import ProfileCard from "./Components/ProfileCard";
import CabinetCarousel from "./Components/CabinetCarousel";
import CardSwap, { Card } from "./Components/CardSwap";
import CircularGallery from "./Components/CircularGalery";

// Dynamic import untuk TrailerModal dan ContentPromoModal
import dynamic from 'next/dynamic';

const TrailerModal = dynamic(() => import("./Components/TrailerModal"), {
  ssr: false
});

const ContentPromoModal = dynamic(() => import("./Components/ContentPromoModal"), {
  ssr: false
});

export default function Home() {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isContentPromoModalOpen, setIsContentPromoModalOpen] = useState(false);
  const [promoContentCount, setPromoContentCount] = useState(0);
  const [featuredFilms, setFeaturedFilms] = useState([]);
  // const lenisRef = useRef(); // No longer needed
  const { scrollYProgress } = useScroll();

  // Disable Lenis Smooth Scroll for better performance
  // useEffect(() => {
  //     const lenis = new Lenis({
  //       duration: 1.2,
  //       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //       direction: 'vertical',
  //       gestureDirection: 'vertical',
  //       smooth: true,
  //       mouseMultiplier: 1,
  //       smoothTouch: false,
  //       touchMultiplier: 2,
  //       infinite: false,
  //     });

  //     lenisRef.current = lenis;

  //     function raf(time) {
  //       lenis.raf(time);
  //       requestAnimationFrame(raf);
  //     }
  //     requestAnimationFrame(raf);

  //     return () => {
  //       lenis.destroy();
  //     };
  // }, []);

  // Fetch featured films
  useEffect(() => {
    const fetchFeaturedFilms = async () => {
      try {
        const response = await fetch('/api/films/featured?limit=6&status=now_showing');
        const data = await response.json();
        
        if (data.meta.status === 'success') {
          const transformedFilms = data.data.films.map(film => ({
            image: film.posterPath || film.posterUrl || '/Images/poster-film/TBFSP.jpg',
            text: film.filmTitle,
            id: film.id,
            trailerUrl: film.trailerUrl
          }));
          setFeaturedFilms(transformedFilms);
        }
      } catch (error) {
        console.error('Error fetching featured films:', error);
        // Fallback to default items
        setFeaturedFilms([
          { image: '/Images/poster-film/TBFSP.jpg', text: 'TBFSP' },
          { image: '/Images/poster-film/TBFSP.jpg', text: 'Film Poster' },
          { image: '/Images/poster-film/TBFSP.jpg', text: 'Nol Derajat' },
          { image: '/Images/poster-film/TBFSP.jpg', text: 'Cinema' },
          { image: '/Images/poster-film/TBFSP.jpg', text: 'Production' },
          { image: '/Images/poster-film/TBFSP.jpg', text: 'Showcase' }
        ]);
      }
    };

    fetchFeaturedFilms();
  }, []);

  // Fetch promo content count with monthly reset
  useEffect(() => {
    const fetchPromoCount = async () => {
      try {
        const response = await fetch('/api/contents/promo');
        const data = await response.json();
        
        if (data.success) {
          const currentMonth = data.monthInfo.currentMonth;
          const currentYear = data.monthInfo.currentYear;
          const monthKey = `${currentYear}-${currentMonth}`;
          
          // Check if we've already shown notification for this month
          const lastShownMonth = localStorage.getItem('nolder-last-shown-month');
          const hasSeenThisMonth = lastShownMonth === monthKey;
          
          // Only show count if there are contents and user hasn't seen this month's content
          if (data.contents.length > 0 && !hasSeenThisMonth) {
            setPromoContentCount(data.contents.length);
          } else {
            setPromoContentCount(0);
          }
        }
      } catch (error) {
        console.error('Error fetching promo count:', error);
      }
    };

    fetchPromoCount();
  }, []);

  // Mark current month as seen when modal is opened
  const handleContentPromoOpen = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    // Mark this month as seen
    localStorage.setItem('nolder-last-shown-month', monthKey);
    setPromoContentCount(0); // Hide notification badge
    
    setIsContentPromoModalOpen(true);
  };



  // Native smooth scroll to section function
  const scrollToSection = (target) => {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />
      
      {/* Main Content */}
      <div className="relative z-10">
          
          {/* SECTION 1: BERANDA - Hero Section */}
          <Hero />


          {/* SECTION 2: ABOUT - Pengenalan dengan Timeline Parallax */}
          <section id="about" className="relative py-32 px-8 sm:px-20">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 drop-shadow-lg tracking-wider">
                  ABOUT US
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
                <p className="text-xl sm:text-3xl text-gray-200 font-light max-w-5xl mx-auto leading-relaxed">
                  Nol Derajat Film merupakan Unit Kegiatan Mahasiswa di Universitas Brawijaya Malang yang berfokus pada bidang sinematografi. 
                  <br /><br />
                  <span className="text-yellow-400 font-semibold">Sebagai wadah kreatif</span>, Nol Derajat Film merupakan tempat kolaboratif bagi seluruh anggotanya untuk berproses dan berkarya dalam beragam aspek perfilman.
                </p>
              </motion.div>

              {/* AboutBentoLayout dengan Spacing */}
              <div className="mb-20">
                <AboutBentoLayout />
              </div>
            </div>
          </section>


          {/* SECTION 3: KABINET - Tim CINEVERSO */}
          <section id="kabinet" className="relative py-32 px-8 sm:px-20">
            <div className="max-w-7xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 tracking-wider">
                  CINEVERSO
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-12" />
                <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-3xl mx-auto mb-16">
                  Tim kabinet yang memimpin visi kreatif dan menjalankan misi sinematik Nol Derajat Film
                </p>
                
                {/* Futuristic Cabinet Carousel */}
                <CabinetCarousel />
              </motion.div>
            </div>
          </section>

          {/* SECTION 4: FILM - Galeri Poster Artistik */}
          <section id="film" className="relative py-32 px-8 sm:px-20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-20 relative"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                {/* CardSwap Left Side (Mirrored) - Behind H2 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 -z-10 opacity-40 pointer-events-none drop-shadow-2xl" style={{ transform: 'scaleX(-1)' }}>
                  <div style={{ height: '500px', position: 'relative' }}>
                    <CardSwap
                      width={280}
                      height={400}
                      cardDistance={60}
                      verticalDistance={70}
                      delay={4500}
                      pauseOnHover={false}
                    >
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          style={{ transform: 'scaleX(-1)' }}
                          loading="lazy"
                        />
                      </Card>
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          style={{ transform: 'scaleX(-1)' }}
                          loading="lazy"
                        />
                      </Card>
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          style={{ transform: 'scaleX(-1)' }}
                          loading="lazy"
                        />
                      </Card>
                    </CardSwap>
                  </div>
                </div>

                {/* CardSwap Right Side - Behind H2 */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 -z-10 opacity-40 pointer-events-none drop-shadow-2xl">
                  <div style={{ height: '500px', position: 'relative' }}>
                    <CardSwap
                      width={280}
                      height={400}
                      cardDistance={60}
                      verticalDistance={70}
                      delay={6000}
                      pauseOnHover={false}
                    >
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          loading="lazy"
                        />
                      </Card>
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          loading="lazy"
                        />
                      </Card>
                      <Card>
                        <Image
                          src="/Images/poster-film/TBFSP.jpg"
                          alt="Film Poster"
                          fill
                          className="object-cover rounded-xl brightness-110 contrast-125 saturate-110 will-change-transform"
                          loading="lazy"
                        />
                      </Card>
                    </CardSwap>
                  </div>
                </div>

                <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 tracking-wider relative z-10">
                  KARYA FILM
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
                <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto">
                  Koleksi karya sinematik yang telah diproduksi dengan dedikasi tinggi dan visi artistik yang kuat
                </p>
              </motion.div>
              
              {/* CircularGallery - Film Poster Showcase */}
              <div className="relative z-10 w-full h-[600px] sm:h-[700px]">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="w-full h-full"
                >
                  <CircularGallery
                    items={featuredFilms.length > 0 ? featuredFilms : [
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'TBFSP' },
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'Film Poster' },
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'Nol Derajat' },
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'Cinema' },
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'Production' },
                      { image: '/Images/poster-film/TBFSP.jpg', text: 'Showcase' }
                    ]}
                    bend={2}
                    textColor="#fbbf24"
                    borderRadius={0.08}
                    font="bold 24px Inter"
                    scrollSpeed={1.5}
                    scrollEase={0.08}
                    autoScroll={false}
                    onItemClick={() => setIsTrailerModalOpen(true)}
                  />
                </motion.div>
              </div>

              {/* All Film Button */}
              <motion.div
                className="relative z-10 text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => window.location.href = '/gallery'}
                  className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl font-bold text-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>ALL FILM</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-600 rounded-tl-2xl opacity-50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-600 rounded-br-2xl opacity-50" />
                </button>
                
                <motion.p 
                  className="text-gray-400 text-sm mt-4 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Jelajahi koleksi lengkap karya sinematik Nol Derajat Film
                </motion.p>
              </motion.div>
            </div>
          </section>


          {/* SECTION 5: PORTFOLIO - Logo Partners */}
          <section id="portfolio" className="relative py-32 px-8 sm:px-20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 tracking-wider">
                  KOLABORASI
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
                <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto">
                  Partner dan kolaborator yang telah bersama kami menciptakan karya-karya sinematik berkualitas
                </p>
              </motion.div>

              {/* Partners Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <motion.div
                    key={item}
                    className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 p-6 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: item * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-yellow-400 text-sm font-semibold">Partner {item}</span>
                  </motion.div>
                ))}

               

                
              </div>

            </div>
          </section>


          {/* Footer */}
          {/* Footer */}
          <footer className="relative py-20 px-8 sm:px-20 border-t border-yellow-400/20">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <Image
                  src="/Images/nolder-logo.png"
                  alt="Nolder Logo"
                  width={60}
                  height={60}
                  className="mx-auto mb-4 opacity-80"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">NOL DERAJAT FILM</h3>
                <p className="text-gray-400">Unit Kegiatan Mahasiswa Universitas Brawijaya</p>
              </div>
              
              <div className="border-t border-gray-800 pt-8">
                <p className="text-gray-500 text-sm">
                  © 2024 Nol Derajat Film. Semua hak cipta dilindungi. 
                  <span className="text-yellow-400"> STOP DREAMING, START ACTION.</span>
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Floating Content Promo Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.3 }}
        >
          <motion.button
            onClick={handleContentPromoOpen}
            className="group relative bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Notification Badge */}
            {promoContentCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {promoContentCount}
              </div>
            )}
            
            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <img
                src="/Images/nolder-logo-item.png"
                alt="Nolder Logo"
                className="w-5 h-5 object-contain"
              />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                Konten Baru
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Trailer Modal */}
        <TrailerModal 
          isOpen={isTrailerModalOpen} 
          onClose={() => setIsTrailerModalOpen(false)}
          videoId="R37-EC48yoc"
        />

        {/* Content Promo Modal */}
        <ContentPromoModal 
          isOpen={isContentPromoModalOpen} 
          onClose={() => setIsContentPromoModalOpen(false)}
        />
      
        {/* Custom CSS untuk Cinematic Effects */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
          
           html {
             scroll-behavior: smooth;
           }
          
          body {
            font-family: 'Inter', sans-serif;
            background: #000000;
          }
          
          .font-cinematic {
            font-family: 'Cinzel', serif;
          }
        
          .bg-gradient-radial {
            background: radial-gradient(var(--tw-gradient-stops));
          }
        
        .text-glow {
          text-shadow: 
            0 0 10px rgba(255, 212, 0, 0.5),
            0 0 20px rgba(255, 212, 0, 0.3),
            0 0 30px rgba(255, 212, 0, 0.2);
        }
        
        .animate-fade-in {
          animation: fadeIn 2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Film Grain Animation - Enhanced */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          10% { transform: translate(-5%, -10%) }
          20% { transform: translate(-15%, 5%) }
          30% { transform: translate(7%, -25%) }
          40% { transform: translate(-5%, 25%) }
          50% { transform: translate(-15%, 10%) }
          60% { transform: translate(15%, 0%) }
          70% { transform: translate(0%, 15%) }
          80% { transform: translate(3%, 35%) }
          90% { transform: translate(-10%, 10%) }
        }
        
        .film-grain {
          animation: grain 8s steps(10) infinite;
        }

        /* Hero spotlight animation */
        @keyframes spotlight {
          0%, 100% { 
            transform: translate(0%, 0%) scale(1);
            opacity: 0.25;
          }
          25% { 
            transform: translate(10%, -5%) scale(1.1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(-5%, 10%) scale(0.9);
            opacity: 0.2;
          }
          75% { 
            transform: translate(-10%, -10%) scale(1.05);
            opacity: 0.35;
          }
        }

        /* Seamless Royal Blue Continuous Background - Enhanced Contrast */
        body {
          background: 
            linear-gradient(
              180deg,
              #000000 0%,           /* Hero - Deep black start */
              #0f0f2a 15%,          /* Hero to About - Stronger dark royal blue */
              #1f1f4a 35%,          /* About to Kabinet - Enhanced medium royal blue */
              #2f2f6a 55%,          /* Kabinet to Film - Richer royal blue */
              #3f3f8a 75%,          /* Film to Portfolio - Much deeper royal blue */
              #1f1f4a 90%,          /* Portfolio to Footer - Return to enhanced medium */
              #000000 100%          /* Footer - Deep black end */
            ),
            radial-gradient(
              ellipse at center,
              rgba(100, 100, 255, 0.12) 0%,  /* Stronger royal blue accent glow */
              rgba(80, 120, 255, 0.08) 30%,  /* Added mid-range blue glow */
              transparent 70%
            );
          background-attachment: fixed;
          background-size: 100% 600vh, 100% 100%;
          min-height: 100vh;
        }
        
        /* Ensure seamless flow */
        html, body {
          background-color: #000000;
          overflow-x: hidden;
        }

        /* Enhanced Section Continuity */
        section {
          position: relative;
          background: transparent;
          backdrop-filter: blur(0.3px);
        }

        /* Subtle section depth without breaking continuity */
        section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0, 0, 0, 0.05) 70%,
            rgba(0, 0, 0, 0.15) 100%
          );
          pointer-events: none;
          z-index: -1;
          opacity: 0.8;
        }

        /* Hero section - minimal overlay to blend with its own effects */
        section:first-of-type::before {
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0, 0, 0, 0.03) 80%,
            rgba(0, 0, 0, 0.08) 100%
          );
          opacity: 0.6;
        }

        /* Footer section - subtle bottom fade */
        footer::before {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        /* Enhanced Royal Blue Cinematic film grain - Stronger overlay */
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(140, 140, 255, 0.04) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(120, 120, 255, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 50% 10%, rgba(100, 100, 255, 0.025) 1px, transparent 1px);
          background-size: 60px 60px, 80px 80px, 100px 100px;
          opacity: 0.15;  /* Increased opacity for more visibility */
          animation: grain 30s linear infinite;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }

        /* Enhanced royal blue vignette effect - Stronger contrast */
        html::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(10, 10, 25, 0.5) 60%,    /* Stronger blue-tinted vignette */
            rgba(15, 15, 35, 0.7) 80%,    /* Enhanced royal blue tint */
            rgba(5, 5, 15, 0.9) 100%      /* Deeper blue-black edge */
          );
          pointer-events: none;
          z-index: 2;
        }
        
        /* Cinematic Glow Effects */
        .golden-glow {
          box-shadow: 
            0 0 20px rgba(255, 212, 0, 0.3),
            0 0 40px rgba(255, 212, 0, 0.2),
            0 0 60px rgba(255, 212, 0, 0.1);
        }
        
        /* Smooth Transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Hidden Admin Access - Triple click on logo to access */}
      <div 
        className="fixed top-4 left-4 w-8 h-8 opacity-0 cursor-pointer"
        onClick={(e) => {
          // Triple click detection
          if (typeof window !== 'undefined') {
            const now = Date.now();
            if (!window.lastClickTime || now - window.lastClickTime > 1000) {
              window.clickCount = 1;
            } else {
              window.clickCount++;
            }
            window.lastClickTime = now;
            
            if (window.clickCount === 3) {
              window.location.href = '/admin/login';
            }
          }
        }}
        title="Triple click for admin access"
      >
        <img
          src="/Images/nolder-logo-item.png"
          alt="Admin Access"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}