
import React, { useState, useEffect } from 'react';
import FilmRoll from './FilmRoll';

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Jika scroll ke bawah, sembunyikan indicator
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowScrollIndicator(false);
      }
      // Jika scroll ke atas atau di posisi atas, tampilkan indicator
      else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowScrollIndicator(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 md:pt-20 lg:pt-32">
      {/* Film Roll Component */}
      <FilmRoll />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Subtle grain effect */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

      <div className="container mx-auto px-8 md:px-4 relative z-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-6 text-white">
            <span className="block" style={{textShadow: 'inset 0 4px 8px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.4)'}}>NOL DERAJAT</span>
            <span className="block text-7xl md:text-9xl lg:text-[10rem] font-black" style={{textShadow: 'inset 0 4px 8px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.4)'}}>
              FILM
            </span>
          </h1>

          {/* Tagline */}
          <div className="mb-8">
            <p className="text-lg md:text-xl lg:text-2xl font-bold tracking-[0.3em] text-gray-300">
              STOP DREAMING START ACTION!!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 tracking-widest font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
            >
              VIEW OUR WORK
            </button>
            <button 
              className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 tracking-widest font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
        showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/30 rounded-full mt-2 animate-bounce"></div>
          </div>
          <span className="text-xs mt-2 tracking-widest text-gray-400">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;