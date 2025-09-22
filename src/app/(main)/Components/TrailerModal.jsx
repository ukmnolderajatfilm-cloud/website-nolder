'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, videoId = "R37-EC48yoc", title = "TBFSP", subtitle = "Official Trailer" }) => {
  // Convert YouTube URL to embed format
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-yellow-400/20"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-2xl font-bold text-yellow-400">
                  {title} - {subtitle}
                </h3>
                <p className="text-gray-400 mt-1">
                  Nol Derajat Film Production
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={`${title} ${subtitle}`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="p-6 bg-gradient-to-r from-gray-900 to-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    Produksi oleh <span className="text-yellow-400 font-semibold">Nol Derajat Film</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Unit Kegiatan Mahasiswa Universitas Brawijaya
                  </p>
                </div>
                <div className="flex space-x-3">
                
                <img
                            src="/Images/nolder-logo.png"
                            alt="Nolder Logo"
                            className="relative w-16 h-16 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                          />

                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg opacity-60" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg opacity-60" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl-lg opacity-60" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br-lg opacity-60" />
          </motion.div>

          {/* Close on Escape Key */}
          <motion.div
            className="fixed inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailerModal;
