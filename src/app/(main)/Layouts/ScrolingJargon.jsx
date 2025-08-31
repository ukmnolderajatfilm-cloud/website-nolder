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

      <span>   STOP DREAMING START ACTION  </span>
    </span>
  );

  const scrollTexts = [
    textWithLogo,
    "STOP DREAMING START ACTION",
  ];

  return (
    <section className="overflow-hidden">
      <div className="relative">
        <ScrollVelocity
          texts={scrollTexts}
          velocity={velocity}
          className={`text-white text-5xl ${className}`}
          scrollerStyle={{
            fontSize: 'inherit',
            lineHeight: '1.1',
          }}
          parallaxStyle={{
            marginBottom: '-1rem',
          }}
        />
      </div>
      
      <style jsx>{`
        section {
          position: relative;
        }
        
        section :global(section) {
          margin-bottom: -2rem;
          line-height: 0.9;
        }
        
        section :global(section:last-child) {
          margin-bottom: 0;
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
          
          section :global(section) {
            margin-bottom: -1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ScrolingJargon;