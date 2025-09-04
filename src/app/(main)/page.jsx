'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Opener from "./Layouts/Opener";
import Navbar from "./Layouts/Navbar";
import AboutBentoLayout from "./Layouts/AboutBentoLayout";
import Hero from "./Components/Hero";

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);
  const lenisRef = useRef();
  const { scrollYProgress } = useScroll();

  const handleOpenerComplete = () => {
    // Delay untuk memberikan waktu transisi slide up ke main content
    setTimeout(() => {
      setShowMainContent(true);
    }, 1000);
  };

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (showMainContent) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [showMainContent]);

  // Smooth scroll to section function
  const scrollToSection = (target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: 0,
        duration: 2.5,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Navbar - Only show when main content is visible */}
      {showMainContent && <Navbar scrollToSection={scrollToSection} />}
      
      {/* Opener Component */}
      {!showMainContent && (
        <Opener onAnimationComplete={handleOpenerComplete} />
      )}
      
      {/* Main Content */}
      {showMainContent && (
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          
          {/* SECTION 1: BERANDA - Hero Section */}
          <Hero />

          {/* SECTION 2: ABOUT - Pengenalan dengan Timeline Parallax */}
          <section id="about" className="relative py-32 px-8 sm:px-20 bg-gradient-to-b from-black via-gray-900 to-black">
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
          <section id="kabinet" className="relative py-32 px-8 sm:px-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
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
                
                {/* Placeholder untuk Kabinet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">Ketua</h3>
                    <p className="text-gray-300">Leadership & Vision</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">Wakil Ketua</h3>
                    <p className="text-gray-300">Strategy & Operations</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* SECTION 4: FILM - Galeri Poster Artistik */}
          <section id="film" className="relative py-32 px-8 sm:px-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 tracking-wider">
                  KARYA FILM
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
                <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto">
                  Koleksi karya sinematik yang telah diproduksi dengan dedikasi tinggi dan visi artistik yang kuat
                </p>
              </motion.div>
              
              {/* Placeholder untuk Film Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 p-6 flex items-center justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: item * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-yellow-400 text-lg font-semibold">Film Poster {item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: PORTFOLIO - Logo Partners */}
          <section id="portfolio" className="relative py-32 px-8 sm:px-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          <footer className="relative py-20 px-8 sm:px-20 bg-black border-t border-yellow-400/20">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <Image
                  src="/Images/nolder-logo.png"
                  alt="Nolder Logo"
                  width={60}
                  height={60}
                  className="mx-auto mb-4 opacity-80"
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
        </motion.div>
      )}
      
      {/* Custom CSS untuk Cinematic Effects */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        html {
          scroll-behavior: auto;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%);
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
        
        /* Film Grain Animation */
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
    </div>
  );
}