
import React, { useState, useEffect } from 'react';
import FilmRoll from './FilmRoll';
import dynamic from 'next/dynamic';

// Dynamic import Masonry to avoid SSR issues
const Masonry = dynamic(() => import('./Masonry/Masonry'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50" />
});

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [masonryItems, setMasonryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        if (response.ok) {
          const result = await response.json();
          setMasonryItems(result.data);
        } else {
          // Fallback to default images if API fails
          setMasonryItems([
            {
              id: "1",
              img: "https://picsum.photos/id/1015/600/900?grayscale",
              url: "#",
              height: 400,
            },
            {
              id: "2", 
              img: "https://picsum.photos/id/1011/600/750?grayscale",
              url: "#",
              height: 250,
            },
            {
              id: "3",
              img: "https://picsum.photos/id/1020/600/800?grayscale", 
              url: "#",
              height: 600,
            },
            {
              id: "4",
              img: "https://picsum.photos/id/1025/600/700?grayscale",
              url: "#", 
              height: 350,
            },
            {
              id: "5",
              img: "https://picsum.photos/id/1031/600/850?grayscale",
              url: "#",
              height: 500,
            },
            {
              id: "6",
              img: "https://picsum.photos/id/1035/600/650?grayscale",
              url: "#",
              height: 300,
            },
            {
              id: "7",
              img: "https://picsum.photos/id/1040/600/900?grayscale",
              url: "#",
              height: 450,
            },
            {
              id: "8",
              img: "https://picsum.photos/id/1043/600/750?grayscale",
              url: "#",
              height: 380,
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Use fallback images
        setMasonryItems([
          {
            id: "1",
            img: "https://picsum.photos/id/1015/600/900?grayscale",
            url: "#",
            height: 400,
          },
          {
            id: "2", 
            img: "https://picsum.photos/id/1011/600/750?grayscale",
            url: "#",
            height: 250,
          },
          {
            id: "3",
            img: "https://picsum.photos/id/1020/600/800?grayscale", 
            url: "#",
            height: 600,
          },
          {
            id: "4",
            img: "https://picsum.photos/id/1025/600/700?grayscale",
            url: "#", 
            height: 350,
          },
          {
            id: "5",
            img: "https://picsum.photos/id/1031/600/850?grayscale",
            url: "#",
            height: 500,
          },
          {
            id: "6",
            img: "https://picsum.photos/id/1035/600/650?grayscale",
            url: "#",
            height: 300,
          },
          {
            id: "7",
            img: "https://picsum.photos/id/1040/600/900?grayscale",
            url: "#",
            height: 450,
          },
          {
            id: "8",
            img: "https://picsum.photos/id/1043/600/750?grayscale",
            url: "#",
            height: 380,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Jika scroll ke bawah, sembunyikan indicator
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowScrollIndicator(false);
      }
      // Jika scroll ke atas atau di posisi atas, tampilkan indicator
      else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowScrollIndicator(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 md:pt-20 lg:pt-32">
      {/* Royal Blue Hero Background - Harmonized with continuous background */}
      <div className="absolute inset-0 z-0">
        {/* Royal blue gradient overlay that enhances the continuous background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 26, 0.6) 25%, rgba(26, 26, 58, 0.4) 50%, rgba(10, 10, 26, 0.6) 75%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />
        
        {/* Cinematic film grain effect - Royal blue tinted */}
        <div className="absolute inset-0 opacity-15">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(100, 100, 255, 0.03) 1px, transparent 1px),
                radial-gradient(circle at 70% 70%, rgba(150, 150, 255, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px, 75px 75px',
              animation: 'grain 20s linear infinite'
            }}
          />
        </div>
        
        {/* Moving royal blue spotlight effect */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 800px 600px at 50% 50%, rgba(100, 100, 255, 0.15) 0%, transparent 50%)',
              animation: 'spotlight 15s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Royal blue vignette - blends with site vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 26, 0.4) 70%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />
      </div>
      
      {/* Masonry Overlay */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
        {loading ? (
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.1}
            animateFrom="random"
            scaleOnHover={false}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        )}
      </div>
      
      {/* Film Roll Component */}
      <FilmRoll />

      <div className="container mx-auto px-5 md:px-4 relative z-30">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main heading with enhanced text shadow */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-6 text-white drop-shadow-2xl">
            <span className="block" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)'}}>NOL DERAJAT</span>
            <span className="block text-7xl md:text-9xl lg:text-[10rem] font-black" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)'}}>
              FILM
            </span>
          </h1>

          {/* Tagline */}
          <div className="mb-8">
            <p className="text-lg md:text-xl lg:text-2xl font-bold tracking-[0.3em] text-gray-300 drop-shadow-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.4)'}}>
              STOP DREAMING START ACTION!!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 tracking-widest font-semibold transition-all duration-300 hover:scale-105 rounded-lg shadow-2xl backdrop-blur-sm"
            >
              VIEW OUR WORK
            </button>
            <button 
              className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 tracking-widest font-semibold transition-all duration-300 hover:scale-105 rounded-lg shadow-2xl backdrop-blur-sm"
            >
              Partnership
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out z-30 ${
        showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/30 rounded-full mt-2 animate-bounce"></div>
          </div>
          <span className="text-xs mt-2 tracking-widest text-gray-400">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;