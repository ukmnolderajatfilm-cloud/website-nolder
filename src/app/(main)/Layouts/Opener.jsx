'use client';

import React, { useState, useEffect } from 'react';
import SplitText from '../Components/SplitText';

const Opener = ({ onAnimationComplete }) => {
  const [showText, setShowText] = useState(false);
  const [allAnimationsComplete, setAllAnimationsComplete] = useState(false);

  useEffect(() => {
    console.log('Opener component mounted');
    
    // Show text immediately when component mounts
    setShowText(true);
    console.log('Text should be visible now');
  }, []);

  const handleSplitTextComplete = () => {
    console.log('SplitText animation completed');
    
    // Wait 3 seconds after text animation completes, then slide up
    setTimeout(() => {
      console.log('Starting slide up animation');
      setAllAnimationsComplete(true);
      
      // After slide up animation completes, call onAnimationComplete
      setTimeout(() => {
        console.log('Calling onAnimationComplete');
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 1000); // 1 second for slide up animation
    }, 3000); // 3 seconds display time after animation
  };

  return (
    <div className={`opener-container ${allAnimationsComplete ? 'slide-up' : ''}`}>
      <div className="content">
        {showText && (
          <SplitText
            text="STOP DREAMING START ACTION !!!"
            delay={150}
            duration={0.8}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            textAlign="center"
            tag="h1"
            onLetterAnimationComplete={handleSplitTextComplete}
            className="main-text"
          />
        )}
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
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
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
          font-size: 5rem ;
          font-weight: 800 ;
          color: #ffffff ;
          margin: 0 ;
          padding: 0.1em 0 ;
          letter-spacing: 0.05em ;
          line-height: 1.1 ;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif ;
          text-align: center;
          transform: translateZ(0);
          width: 100%;
        }
        
        .main-text .split-word {
          display: inline-block;
          margin-right: 0.3em;
          color: #ffffff;
        }
        
        .main-text .split-char {
          display: inline-block;
          color: #ffffff;
        }
        
        @media (max-width: 768px) {
          .main-text {
            font-size: 3rem ;
            line-height: 1 ;
          }
        }
        
        @media (max-width: 480px) {
          .main-text {
            font-size: 2rem ;
            letter-spacing: 0.03em ;
            line-height: 1.1 ;
          }
        }
      `}</style>
    </div>
  );
};

export default Opener;