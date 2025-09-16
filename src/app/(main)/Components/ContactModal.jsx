'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contact options dengan data lengkap
  const contactOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Chat dengan kami langsung',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
        </svg>
      ),
      color: 'from-green-400 to-green-600',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      hoverColor: 'rgba(34, 197, 94, 0.2)',
      link: 'https://wa.me/6281234567890',
      delay: 0.1
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Follow social media kami',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'from-pink-400 to-purple-600',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      hoverColor: 'rgba(236, 72, 153, 0.2)',
      link: 'https://instagram.com/nolderajatfilm',
      delay: 0.2
    },
    {
      id: 'line',
      name: 'Line',
      description: 'Chat melalui Line official',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12.017.572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      ),
      color: 'from-green-500 to-green-700',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      hoverColor: 'rgba(34, 197, 94, 0.2)',
      link: 'https://line.me/ti/p/nolderajatfilm',
      delay: 0.3
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Kirim email resmi ke kami',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
      ),
      color: 'from-red-400 to-red-600',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      hoverColor: 'rgba(239, 68, 68, 0.2)',
      link: 'mailto:contact@nolderajatfilm.com',
      delay: 0.4
    }
  ];

  // Handle click outside modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleContactClick = (option) => {
    setIsAnimating(true);
    setSelectedOption(option.id);
    
    setTimeout(() => {
      window.open(option.link, '_blank');
      setIsAnimating(false);
      setSelectedOption(null);
      onClose();
    }, 800);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: -15,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateX: 15,
      y: -100,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Cinematic Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            onClick={onClose}
          />
          
          {/* Cinematic Film Grain Background */}
          <div className="absolute inset-0 opacity-25">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.04) 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, rgba(255, 140, 0, 0.03) 1px, transparent 1px),
                  radial-gradient(circle at 50% 10%, rgba(139, 69, 19, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px, 40px 40px, 80px 80px',
                animation: 'cinematicGrain 25s linear infinite'
              }}
            />
          </div>

          {/* Cinematic Light Rays */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div 
              className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-conic from-yellow-400/15 via-transparent to-transparent"
              style={{
                background: 'conic-gradient(from 45deg, rgba(255, 215, 0, 0.08) 0deg, transparent 60deg, transparent 300deg, rgba(255, 215, 0, 0.04) 360deg)',
                animation: 'cinematicRotate 35s linear infinite'
              }}
            />
            <div 
              className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-conic from-orange-500/15 via-transparent to-transparent"
              style={{
                background: 'conic-gradient(from 225deg, rgba(255, 140, 0, 0.06) 0deg, transparent 90deg, transparent 270deg, rgba(255, 140, 0, 0.03) 360deg)',
                animation: 'cinematicRotate 45s linear infinite reverse'
              }}
            />
          </div>

          {/* Modal Container */}
          <motion.div
            key="modal-container"
            className="relative w-full max-w-2xl mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ perspective: 1000 }}
          >
            {/* Cinematic Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-orange-600/20 to-amber-600/30 rounded-3xl blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent rounded-3xl" />
            
            {/* Main Modal - Cinematic Design */}
            <div className="relative bg-gradient-to-br from-black/98 via-gray-950/95 to-black/98 backdrop-blur-2xl border-2 border-yellow-600/30 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10">
              
              {/* Film Strip Decoration */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600/20 via-yellow-500/30 to-yellow-600/20 flex items-center justify-center space-x-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-yellow-400/40 rounded-full" />
                ))}
              </div>
              
              {/* Film Strip Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600/20 via-yellow-500/30 to-yellow-600/20 flex items-center justify-center space-x-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-yellow-400/40 rounded-full" />
                ))}
              </div>
              
              {/* Header Section - Cinematic Style */}
              <div className="relative pt-12 pb-8 px-8 border-b border-yellow-600/20">
                {/* Cinematic Header Background */}
                <div className="absolute inset-0 opacity-10">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, rgba(255, 215, 0, 0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 215, 0, 0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                </div>
                
                {/* Cinematic Spotlight Effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-radial from-yellow-400/20 to-transparent blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div
                      className="flex items-center justify-between mb-4"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Left Side - Communication Icon & Title */}
                      <div className="flex items-center space-x-4">
                        {/* Communication Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                          <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </div>
                        
                        <div>
                          <motion.h2 
                            className="text-4xl font-bold text-white mb-1 font-serif tracking-wide"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                          >
                            CONTACT SYSTEM
                          </motion.h2>
                          <motion.div 
                            className="h-0.5 w-32 bg-gradient-to-r from-yellow-400 to-orange-500 mb-2"
                            initial={{ width: 0 }}
                            animate={{ width: 128 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Right Side - Nolder Logo */}
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg" />
                          <img
                            src="/Images/nolder-logo.png"
                            alt="Nolder Logo"
                            className="relative w-16 h-16 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                    
                    <motion.p 
                      className="text-gray-300 text-lg font-light italic max-w-2xl leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      "Hubungi kami melalui platform komunikasi pilihan Anda untuk kolaborasi yang luar biasa"
                    </motion.p>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    className="group p-3 bg-gray-800/50 hover:bg-red-500/20 border border-gray-600 hover:border-red-500/50 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Contact Options Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleContactClick(option)}
                      disabled={isAnimating}
                      className={`group relative p-6 bg-gradient-to-br from-black/60 to-gray-950/80 border-2 border-yellow-600/30 rounded-2xl hover:border-yellow-400/60 transition-all duration-500 disabled:opacity-50 overflow-hidden backdrop-blur-sm ${
                        selectedOption === option.id ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30' : 'hover:shadow-lg hover:shadow-yellow-400/20'
                      }`}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: option.delay, duration: 0.5 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Cinematic Background Glow */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl`}
                      />
                      
                      {/* Cinematic Scan Line */}
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      
                      {/* Film Strip Effect */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600/40 via-yellow-500/60 to-yellow-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600/40 via-yellow-500/60 to-yellow-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="relative flex items-center space-x-4">
                        {/* Icon Container */}
                        <div className={`p-3 bg-gradient-to-br ${option.color} rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          {option.icon}
                        </div>
                        
                        {/* Text Content - Cinematic Style */}
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-1 font-serif tracking-wide group-hover:from-yellow-200 group-hover:to-orange-300 transition-all duration-300"
                              style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.3)' }}>
                            {option.name}
                          </h3>
                          <p className="text-gray-300 text-sm font-light italic group-hover:text-gray-200 transition-colors duration-300">
                            {option.description}
                          </p>
                        </div>

                        {/* Cinematic Arrow Icon */}
                        <motion.div
                          className="text-yellow-400/60 group-hover:text-yellow-300 transition-colors duration-300"
                          animate={{ x: selectedOption === option.id ? 10 : 0 }}
                        >
                          <svg className="w-6 h-6 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </motion.div>
                      </div>

                      {/* Loading Animation */}
                      <AnimatePresence mode="wait">
                        {selectedOption === option.id && (
                          <motion.div
                            key={`loading-${option.id}`}
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                <motion.div 
                  className="text-center text-gray-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="font-light italic">Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-bold">NOL DERAJAT FILM</span> • Cinematic Communication System</p>
                </motion.div>
              </div>
            </div>

            {/* Cinematic Corner Decorations */}
            <div className="absolute top-4 left-4 w-12 h-12">
              <div className="w-full h-full border-t-3 border-l-3 border-yellow-400/70 rounded-tl-3xl" />
              <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            </div>
            <div className="absolute top-4 right-4 w-12 h-12">
              <div className="w-full h-full border-t-3 border-r-3 border-orange-400/70 rounded-tr-3xl" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
            </div>
            <div className="absolute bottom-4 left-4 w-12 h-12">
              <div className="w-full h-full border-b-3 border-l-3 border-yellow-400/70 rounded-bl-3xl" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12">
              <div className="w-full h-full border-b-3 border-r-3 border-orange-400/70 rounded-br-3xl" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Additional CSS for Cinematic Animations */}
      <style jsx global>{`
        @keyframes cinematicGrain {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 0.25;
          }
          25% { 
            transform: translate(-2%, -3%) rotate(0.5deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(1%, -1%) rotate(-0.3deg); 
            opacity: 0.2;
          }
          75% { 
            transform: translate(-1%, 2%) rotate(0.2deg); 
            opacity: 0.35;
          }
        }
        
        @keyframes cinematicRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Cinematic Border Utilities */
        .border-t-3 { border-top-width: 3px; }
        .border-l-3 { border-left-width: 3px; }
        .border-r-3 { border-right-width: 3px; }
        .border-b-3 { border-bottom-width: 3px; }
        .rounded-tl-3xl { border-top-left-radius: 1.5rem; }
        .rounded-tr-3xl { border-top-right-radius: 1.5rem; }
        .rounded-bl-3xl { border-bottom-left-radius: 1.5rem; }
        .rounded-br-3xl { border-bottom-right-radius: 1.5rem; }
      `}</style>
    </AnimatePresence>
  );
};

export default ContactModal;
