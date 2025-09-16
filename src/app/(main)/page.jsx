'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Opener from "./Layouts/Opener";
import Navbar from "./Layouts/Navbar";
import AboutBentoLayout from "./Layouts/AboutBentoLayout";
import Hero from "./Components/Hero";
import ProfileCard from "./Components/ProfileCard";
import CabinetCarousel from "./Components/CabinetCarousel";
import PartnershipModal from "./Components/PartnershipModal";

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);
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
    <div className="relative min-h-screen">
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

              {/* Partnership CTA */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setIsPartnershipModalOpen(true)}
                  className="group relative px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl font-bold text-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-3">
                    <span>START PARTNERSHIP</span>
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
                  transition={{ duration: 1, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  Bergabunglah dengan kami untuk menciptakan karya sinematik yang menginspirasi dan berkualitas tinggi
                </motion.p>
              </motion.div>
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

      {/* Partnership Modal */}
      <PartnershipModal 
        isOpen={isPartnershipModalOpen} 
        onClose={() => setIsPartnershipModalOpen(false)} 
      />
      
      {/* Custom CSS untuk Cinematic Effects */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        html {
          scroll-behavior: auto;
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
    </div>
  );
}