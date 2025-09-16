'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FilmRoll = () => {
  // Create film strip holes pattern - responsive count
  const filmHoles = Array.from({ length: 60 }, (_, i) => i);

  return (
    <>
      {/* Left Film Strip - Fixed for continuous scroll */}
      <div className="fixed left-0 top-0 bottom-0 w-20 z-30 pointer-events-none">
        <motion.div 
          className="h-full w-full bg-gray-900 relative"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          {/* Film strip structure */}
          <div className="h-full w-full flex">
            {/* Left perforation column */}
            <div className="w-2 h-full flex flex-col justify-start gap-1.5 pt-1 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`left-perf-${hole}`} className="w-1.5 h-1.5 bg-black rounded-full mx-auto" />
              ))}
            </div>
             {/* Film frames area */}
            <div className="flex-1 h-full bg-gray-800 border-l border-r border-gray-700 flex flex-col gap-2 py-3 px-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={`left-frame-${i}`}
                  className="h-20 bg-gray-700 border border-gray-600 rounded-sm relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.3, ease: "easeOut" }}
                >
                  {/* Film frame inner area - simulating actual photo/scene */}
                  <div className="absolute inset-1 bg-gray-600 rounded-sm" />
                </motion.div>
              ))}
            </div>
           
            
            {/* Right perforation column */}
            <div className="w-2 h-full flex flex-col justify-start gap-1.5 pt-1 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`left-perf-right-${hole}`} className="w-1.5 h-1.5 bg-black rounded-full mx-auto" />
              ))}
            </div>
          </div>
          
          {/* Film strip border */}
          <div className="absolute inset-0 border-r-2 border-white" />
        </motion.div>
      </div>

      {/* Right Film Strip - Fixed for continuous scroll */}
      <div className="fixed right-0 top-0 bottom-0 w-20 z-30 pointer-events-none">
        <motion.div 
          className="h-full w-full bg-gray-900 relative"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          {/* Film strip structure */}
          <div className="h-full w-full flex">
            {/* Left perforation column */}
            <div className="w-2 h-full flex flex-col justify-start gap-1.5 pt-1 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`right-perf-left-${hole}`} className="w-1.5 h-1.5 bg-black rounded-full mx-auto" />
              ))}
            </div>
            
            {/* Film frames area */}
            <div className="flex-1 h-full bg-gray-800 border-l border-r border-gray-700 flex flex-col gap-2 py-3 px-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={`right-frame-${i}`}
                  className="h-20 bg-gray-700 border border-gray-600 rounded-sm relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.3, ease: "easeOut" }}
                >
                  {/* Film frame inner area - simulating actual photo/scene */}
                  <div className="absolute inset-1 bg-gray-600 rounded-sm" />
                </motion.div>
              ))}
            </div>
            
            {/* Right perforation column */}
            <div className="w-2 h-full flex flex-col justify-start gap-1.5 pt-1 bg-gray-900">
              {filmHoles.map((hole) => (
                <div key={`right-perf-${hole}`} className="w-1.5 h-1.5 bg-black rounded-full mx-auto" />
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
