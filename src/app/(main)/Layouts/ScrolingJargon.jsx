'use client';

import React from 'react';
import Image from 'next/image';
import ScrollVelocity from '../Components/ScrollVelocity/ScrollVelocity';

const ScrolingJargon = ({ 
  velocity = 80,
  className = "",
  damping = 10,
  stiffness = 400,
  numCopies = 8,
  velocityMapping = { input: [0, 1000], output: [0, 1] }
}) => {
  // Custom text dengan logo di awal
  const textWithLogo = (
    <span className="flex items-center gap-4">
      <Image
        src="/Images/nolder-logo.png"
        alt="Nolder Logo"
        width={50}
        height={50}
        className="object-contain"
        priority
      />

      <span>   STOP DREAMING START ACTION   </span>
    </span>
  );

  const scrollTexts = [
    textWithLogo,
    "STOP DREAMING START ACTION",
  ];

  return (
    <section className=" bg-black overflow-hidden">
      <div className="relative">
        <ScrollVelocity
          texts={scrollTexts}
          velocity={velocity}
          className={`text-white ${className}`}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          scrollerClassName="flex items-center"
          parallaxStyle={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
          scrollerStyle={{
            fontWeight: '500',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>
      
      <style jsx>{`
        section {
          position: relative;
        
        }
        
        .text-glow {
          text-shadow: 
            0 0 5px rgba(255, 255, 255, 0.3),
            0 0 10px rgba(255, 255, 255, 0.2),
            0 0 15px rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          section {
            padding: 1rem 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ScrolingJargon;