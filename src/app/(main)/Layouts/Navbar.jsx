'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100); // Muncul setelah scroll 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative px-6 py-4">
          {/* Background yang bisa hilang/muncul */}
          <div className={`absolute inset-0 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl transition-all duration-700 ease-out transform ${
            isScrolled 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}></div>
          
          {/* Content yang selalu terlihat */}
          <div className="relative flex items-center justify-between">
            
            {/* Logo Section - Pojok Kiri */}
            <Link href="/" className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
              {/* Logo Kotak */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:from-white/30 group-hover:to-white/20 transition-all duration-300">
                <Image 
                  src="/Images/nolder-logo.png" 
                  alt="Nolder Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Text "Nol Derajat Film" */}
              <div className="text-white font-bold text-lg tracking-wide">
                NOL DERAJAT FILM
              </div>
            </Link>

            {/* Desktop Navigation - Pojok Kanan */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('#about')}
                className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection('#kabinet')}
                className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Kabinet
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection('#film')}
                className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Film
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection('#portfolio')}
                className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Portfolio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
                <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-white/20">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    scrollToSection('#about');
                    setIsMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 text-left"
                >
                  About
                </button>
                
                <button 
                  onClick={() => {
                    scrollToSection('#kabinet');
                    setIsMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 text-left"
                >
                  Kabinet
                </button>
                
                <button 
                  onClick={() => {
                    scrollToSection('#film');
                    setIsMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 text-left"
                >
                  Film
                </button>
                
                <button 
                  onClick={() => {
                    scrollToSection('#portfolio');
                    setIsMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 text-left"
                >
                  Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;