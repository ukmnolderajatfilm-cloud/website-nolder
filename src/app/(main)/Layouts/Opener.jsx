'use client';

import React, { useState } from 'react';
import BlurText from '../Components/BlurText/BlurText';

const Opener = ({ onAnimationComplete }) => {
  const [allAnimationsComplete, setAllAnimationsComplete] = useState(false);

  const handleSecondLineComplete = () => {
    // Delay 5 detik agar user bisa melihat tulisan dengan jelas
    setTimeout(() => {
      setAllAnimationsComplete(true);
      // Delay tambahan untuk slide up animation
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 1000);
    }, 1000);
  };

  return (
    <div className={`opener-container ${allAnimationsComplete ? 'slide-up' : ''}`}>
      <div className="content">
        <BlurText
          text="STOP DREAMING START ACTION !!!"
          delay={200}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleSecondLineComplete}
          className="text-7xl main-text"
        />
      </div>
      
      <style jsx>{`
        .opener-container {
          width: 100vw;
          height: 100vh;
          background-color: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .opener-container.slide-up {
          transform: translateY(-100%);
        }
        
        .content {
          text-align: center;
          z-index: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }
        
        .main-text {
          font-size: 1000px ;
          font-weight: 950 ;
          color: #ffffff ;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(255, 255, 255, 0.4),
            0 0 40px rgba(255, 255, 255, 0.2) ;
          margin: 0 ;
          padding: 0.1em 0 ;
          letter-spacing: 0.02em ;
          line-height: 0.9 ;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif ;
          animation: glow 3s ease-in-out infinite alternate ;
          transform: translateZ(0);
          will-change: text-shadow;
        }
        
        .main-text span {
          color: #ffffff ;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(255, 255, 255, 0.4),
            0 0 40px rgba(255, 255, 255, 0.2) ;
          transition: all 0.3s ease-out;
        }
        
        @keyframes glow {
          0% {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.6),
              0 0 30px rgba(255, 255, 255, 0.4),
              0 0 40px rgba(255, 255, 255, 0.2) ;
          }
          50% {
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 1),
              0 0 30px rgba(255, 255, 255, 0.9),
              0 0 40px rgba(255, 255, 255, 0.7),
              0 0 50px rgba(255, 255, 255, 0.5) ;
          }
          100% {
            text-shadow: 
              0 0 15px rgba(255, 255, 255, 1),
              0 0 25px rgba(255, 255, 255, 0.8),
              0 0 35px rgba(255, 255, 255, 0.6),
              0 0 45px rgba(255, 255, 255, 0.4) ;
          }
        }
        
        @media (max-width: 768px) {
          .main-text {
            font-size: 70px ;
            line-height: 0.8 ;
          }
        }
        
        @media (max-width: 480px) {
          .main-text {
            font-size: 50px ;
            letter-spacing: 0.01em ;
          }
        }
      `}</style>
    </div>
  );
};

export default Opener;