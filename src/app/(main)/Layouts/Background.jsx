'use client';

import React from 'react';
import Beams from '../Components/Beams/Beams';

const Background = ({ 
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  className = ""
}) => {
  return (
    <div 
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    >
      <Beams
        beamWidth={beamWidth}
        beamHeight={beamHeight}
        beamNumber={beamNumber}
        lightColor={lightColor}
        speed={speed}
        noiseIntensity={noiseIntensity}
        scale={scale}
        rotation={rotation}
      />
    </div>
  );
};

export default Background;