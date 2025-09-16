'use client';

import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Cinematic film grain effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="film-grain-bg w-full h-full" />
      </div>
      
      {/* Moving spotlight effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="spotlight-effect" />
      </div>
      
      {/* Subtle scanlines for cinematic feel */}
      <div className="absolute inset-0 opacity-10">
        <div className="scanlines w-full h-full" />
      </div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
    </div>
  );
};

export default Background;
