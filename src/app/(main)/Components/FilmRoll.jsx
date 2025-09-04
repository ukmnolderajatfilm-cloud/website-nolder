'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FilmRoll = () => {
  // Create film strip holes pattern
  const filmHoles = Array.from({ length: 25 }, (_, i) => i);

  return (
    <>
      {/* Left Film Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 z-30 pointer-events-none">
        <motion.div 
          className="h-full w-full bg-gray-900 relative"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          {/* Film strip structure */}
          <div className="h-full w-full flex">
            {/* Left perforation column */}
            <div className="w-2 md:w-3 h-full flex flex-col justify-start gap-2 md:gap-3 pt-2 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`left-perf-${hole}`} className="w-1.5 md:w-2 h-1.5 md:h-2 bg-black rounded-full mx-auto" />
              ))}
            </div>
            
            {/* Film frames area */}
            <div className="flex-1 h-full bg-gray-800 border-l border-r border-gray-700 flex flex-col gap-0.5 md:gap-1 py-1 md:py-2 px-0.5 md:px-1">
              {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                  key={`left-frame-${i}`}
                  className="h-8 md:h-10 lg:h-12 bg-gray-700 border border-gray-600 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.03, duration: 0.2 }}
                />
              ))}
            </div>
            
            {/* Right perforation column */}
            <div className="w-2 md:w-3 h-full flex flex-col justify-start gap-2 md:gap-3 pt-2 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`left-perf-right-${hole}`} className="w-1.5 md:w-2 h-1.5 md:h-2 bg-black rounded-full mx-auto" />
              ))}
            </div>
          </div>
          
          {/* Film strip border */}
          <div className="absolute inset-0 border-r-2 border-white" />
        </motion.div>
      </div>

      {/* Right Film Strip */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 z-30 pointer-events-none">
        <motion.div 
          className="h-full w-full bg-gray-900 relative"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          {/* Film strip structure */}
          <div className="h-full w-full flex">
            {/* Left perforation column */}
            <div className="w-2 md:w-3 h-full flex flex-col justify-start gap-2 md:gap-3 pt-2 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`right-perf-left-${hole}`} className="w-1.5 md:w-2 h-1.5 md:h-2 bg-black rounded-full mx-auto" />
              ))}
            </div>
            
            {/* Film frames area */}
            <div className="flex-1 h-full bg-gray-800 border-l border-r border-gray-700 flex flex-col gap-0.5 md:gap-1 py-1 md:py-2 px-0.5 md:px-1">
              {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                  key={`right-frame-${i}`}
                  className="h-8 md:h-10 lg:h-12 bg-gray-700 border border-gray-600 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.03, duration: 0.2 }}
                />
              ))}
            </div>
            
            {/* Right perforation column */}
            <div className="w-2 md:w-3 h-full flex flex-col justify-start gap-2 md:gap-3 pt-2 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`right-perf-${hole}`} className="w-1.5 md:w-2 h-1.5 md:h-2 bg-black rounded-full mx-auto" />
              ))}
            </div>
          </div>
          
          {/* Film strip border */}
          <div className="absolute inset-0 border-l-2 border-white" />
        </motion.div>
      </div>
    </>
  );
};

export default FilmRoll;
