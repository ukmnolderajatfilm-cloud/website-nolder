'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SplitText = ({
  text = '',
  delay = 100,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'words',
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
  threshold = 0,
  rootMargin = '0px',
  textAlign = 'left',
  tag = 'div',
  onLetterAnimationComplete,
  className = '',
  ...props
}) => {
  const elementRef = useRef(null);
  const splitTextRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current || !text) return;

    const element = elementRef.current;
    
    // Split text into words or characters
    const splitChars = splitType === 'chars';
    const words = text.split(' ');
    
    // Clear existing content
    element.innerHTML = '';
    
    // Create wrapper elements for each word/char
    const elements = [];
    
    if (splitChars) {
      // Split by characters
      const chars = text.split('');
      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        element.appendChild(span);
        elements.push(span);
      });
    } else {
      // Split by words
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'split-word';
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.3em';
        element.appendChild(span);
        elements.push(span);
      });
    }

    // Set initial state
    gsap.set(elements, from);

    // Create animation timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      }
    });

    // Add stagger animation
    tl.to(elements, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000, // Convert ms to seconds
    });

    // Use ScrollTrigger if threshold > 0, otherwise start immediately
    if (threshold > 0) {
      ScrollTrigger.create({
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        once: true,
        onEnter: () => tl.play(),
      });
    } else {
      // Start animation immediately
      tl.play();
    }

    // Store references for cleanup
    splitTextRef.current = { tl, elements };

    // Cleanup function
    return () => {
      if (splitTextRef.current) {
        splitTextRef.current.tl.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      }
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, onLetterAnimationComplete]);

  // Create the element with proper tag
  const Tag = tag;

  return (
    <Tag
      ref={elementRef}
      className={className}
      style={{ textAlign }}
      {...props}
    />
  );
};

export default SplitText;




