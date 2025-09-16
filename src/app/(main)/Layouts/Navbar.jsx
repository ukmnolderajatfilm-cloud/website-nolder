'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactModal from '../Components/ContactModal';

const Navbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const navigationItems = [
    { label: 'ABOUT', section: '#about', action: 'scroll' },
    { label: 'FILM', section: '#film', action: 'scroll' },
    { label: 'Our Kabinet', section: '#kabinet', action: 'scroll' },
    { label: 'PROJECT', section: '#project', action: 'scroll' },
    { label: 'CONTACT', section: '#contact', action: 'modal' }
  ];

  const handleNavigation = (item) => {
    if (item.action === 'modal') {
      setIsContactModalOpen(true);
    } else {
      scrollToSection(item.section);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full py-6 mt-5">
      <nav
        className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        role="navigation"
        aria-label="Primary navigation"
      >
        {/* Brand Section */}
        <Link
          href="/"
          className="flex items-center gap-3 mb-4 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg transition-opacity duration-300 hover:opacity-70"
          aria-label="NOL DERAJAT FILM, Home"
        >
          {/* Film Icon using existing logo */}
          <div className="h-8 w-8 flex items-center justify-center">
            <Image 
              src="/Images/nolder-logo.png" 
              alt="Nolder Logo" 
              width={32} 
              height={32}
              className="object-contain opacity-90"
              priority
            />
          </div>
          <span className="text-[18px] sm:text-[20px] font-semibold tracking-wide leading-none text-white">
            NOL DERAJAT FILM
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:block">
          <div className="rounded-full border border-white/20 bg-white/5 backdrop-blur px-0 py-0 inline-flex">
            {navigationItems.map((item, index) => (
              <React.Fragment key={item.section}>
                <button
                  onClick={() => handleNavigation(item)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleNavigation(item))}
                  className={`px-5 py-2 text-[14px] sm:text-[15px] uppercase tracking-wide text-white/90 hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md transition-all duration-300 ease-in-out min-h-[44px] flex items-center ${
                    item.action === 'modal' ? 'hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20' : ''
                  }`}
                  aria-label={item.action === 'modal' ? `Open ${item.label} modal` : `Navigate to ${item.label} section`}
                >
                  {item.label}
                  {item.action === 'modal' && (
                    <svg className="w-4 h-4 ml-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </button>
                {index < navigationItems.length - 1 && (
                  <span className="px-3 text-white/30" aria-hidden="true"></span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
          className="md:hidden absolute top-6 right-4 sm:right-6 lg:right-8 p-3 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span 
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1.5'
              }`}
              aria-hidden="true"
            />
            <span 
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            />
            <span 
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1.5'
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden w-full transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur p-4">
            <ul className="flex flex-col gap-2" role="menu">
              {navigationItems.map((item) => (
                <li key={item.section} role="none">
                  <button 
                    onClick={() => {
                      handleNavigation(item);
                      setIsMenuOpen(false);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      handleNavigation(item);
                      setIsMenuOpen(false);
                    })}
                    className={`w-full text-center px-5 py-3 text-[14px] uppercase tracking-wide text-white/90 hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md transition-all duration-300 ease-in-out min-h-[44px] flex items-center justify-center ${
                      item.action === 'modal' ? 'hover:text-blue-400' : ''
                    }`}
                    role="menuitem"
                    tabIndex={isMenuOpen ? 0 : -1}
                    aria-label={item.action === 'modal' ? `Open ${item.label} modal` : `Navigate to ${item.label} section`}
                  >
                    {item.label}
                    {item.action === 'modal' && (
                      <svg className="w-4 h-4 ml-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;