'use client';

import React, { useState } from 'react';
import Image from "next/image";
import Opener from "./Layouts/Opener";
import Background from "./Layouts/Background";
import Navbar from "./Layouts/Navbar";
import AboutBentoLayout from "./Layouts/AboutBentoLayout";
import ScrolingJargon from "./Layouts/ScrolingJargon";

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);

  const handleOpenerComplete = () => {
    // Delay untuk memberikan waktu transisi slide up ke main content
    setTimeout(() => {
      setShowMainContent(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Navbar - Only show when main content is visible */}
      {showMainContent && <Navbar />}
      
      {/* Opener Component */}
      {!showMainContent && (
        <Opener onAnimationComplete={handleOpenerComplete} />
      )}
      
      {/* Main Content */}
      {showMainContent && (
        <div className="relative z-10 animate-fade-in">
          
          
          {/* Hero Section with Background Beams */}
          <div className="relative font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 pt-24">
            {/* Background Beams - Only for Hero Section */}
            <div className="absolute inset-0 overflow-hidden">
              <Background 
                beamWidth={5}
                beamHeight={25}
                beamNumber={30}
                lightColor="#ffffff"
                speed={5}
                noiseIntensity={3}
                scale={0.15}
                rotation={52}
              />
            </div>
            
            {/* Content Overlay - Much lighter for better visibility */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" style={{ zIndex: 1 }} />
            
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-20">
              <Image
                className="dark:invert drop-shadow-2xl"
                src="/Images/nolder-logo.png"
                alt="Nolder Logo"
                width={80}
                height={80}
                priority
              />
              
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  NOL DERAJAT FILM
                </h1>
                <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-2xl">
                  Komunitas filmmaker yang berdedikasi menciptakan karya visual menginspirasi
                </p>
              </div>

              <div className="flex gap-6 items-center flex-col sm:flex-row">
                <a
                  className="rounded-full border-2 border-solid border-white/[.3] backdrop-blur-md transition-all duration-300 flex items-center justify-center bg-white/[.15] text-white gap-3 hover:bg-white/[.25] hover:border-white/[.5] hover:shadow-lg font-semibold text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 shadow-md"
                  href="/portofolio"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Lihat Portfolio
                </a>
                <a
                  className="rounded-full border-2 border-solid border-white/[.3] backdrop-blur-md transition-all duration-300 flex items-center justify-center hover:bg-white/[.15] hover:border-white/[.5] hover:shadow-lg font-semibold text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto text-white shadow-md"
                  href="/contact"
                >
                  Hubungi Kami
                </a>
              </div>
            </main>
            
            {/* ScrollingJargon within Hero Section */}
            <div className="absolute bottom-16 left-0 right-0 z-30">
              <ScrolingJargon 
                velocity={80}
                damping={60}
                stiffness={300}
                numCopies={8}
                velocityMapping={{ input: [0, 1000], output: [0, 3] }}
                className="text-glow"
              />
            </div>
          </div>

          {/* About Us Section - With MagicBento */}
          <section className="relative z-20 py-20 px-8 sm:px-20 bg-black">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-5xl sm:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                  ABOUT US
                </h2>
                <div className="w-24 h-1 bg-white mx-auto mb-8 opacity-80"></div>
                <p className="text-xl sm:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                  Kami adalah komunitas filmmaker yang berdedikasi untuk menciptakan karya-karya visual yang menginspirasi dan bermakna.
                </p>
              </div>

              {/* MagicBento Content Grid - Replacing the old grid */}
              <AboutBentoLayout />

              {/* Call to Action */}
              <div className="text-center mt-20">
                <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-12 hover:from-white/25 hover:to-white/15 transition-all duration-300">
                  <h3 className="text-4xl font-bold text-white mb-6">Mari Berkolaborasi</h3>
                  <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                    Punya ide kreatif atau proyek yang ingin diwujudkan? 
                    Mari bergabung dengan kami untuk menciptakan karya yang luar biasa.
                  </p>
                  <div className="flex gap-4 justify-center flex-col sm:flex-row">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Hubungi Kami
                    </a>
                    <a
                      href="/portofolio"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
                    >
                      Lihat Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-20 py-8 px-8 sm:px-20 bg-black">
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-[32px] flex-wrap items-center justify-center bg-black/20 p-6 rounded-lg backdrop-blur-sm">
                <a
                  className="flex items-center gap-3 hover:underline hover:underline-offset-4 text-white/[.9] hover:text-white transition-all duration-300 font-medium text-base hover:scale-105"
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/file.svg"
                    alt="File icon"
                    width={18}
                    height={18}
                    className="invert"
                  />
                  Learn
                </a>
                <a
                  className="flex items-center gap-3 hover:underline hover:underline-offset-4 text-white/[.9] hover:text-white transition-all duration-300 font-medium text-base hover:scale-105"
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/window.svg"
                    alt="Window icon"
                    width={18}
                    height={18}
                    className="invert"
                  />
                  Examples
                </a>
                <a
                  className="flex items-center gap-3 hover:underline hover:underline-offset-4 text-white/[.9] hover:text-white transition-all duration-300 font-medium text-base hover:scale-105"
                  href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    aria-hidden
                    src="/globe.svg"
                    alt="Globe icon"
                    width={18}
                    height={18}
                    className="invert"
                  />
                  Go to nextjs.org →
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}