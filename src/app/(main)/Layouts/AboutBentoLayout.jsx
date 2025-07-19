'use client';

import React from 'react';
import MagicBento from '../Components/MagicBento/MagicBento';

// Custom hook untuk override cardData dengan konten About Us
const useAboutUsData = () => {
  return [
    {
      color: "#060010",
      title: "Visi Kami",
      description: "Menjadi wadah kreatif terdepan yang menghubungkan cerita dengan emosi, menciptakan karya sinematik yang memberikan dampak positif.",
      label: "Vision",
    },
    {
      color: "#060010", 
      title: "Misi Kami",
      description: "Mengembangkan talenta filmmaker lokal, memproduksi konten berkualitas tinggi, dan membangun ekosistem kreatif berkelanjutan.",
      label: "Mission",
    },
    {
      color: "#060010",
      title: "5+ Tahun",
      description: "Pengalaman dalam industri perfilman dengan dedikasi penuh untuk menghasilkan karya terbaik.",
      label: "Experience",
    },
    {
      color: "#060010",
      title: "50+ Proyek",
      description: "Telah menyelesaikan berbagai macam proyek film dan video dengan standar profesional tinggi.",
      label: "Projects",
    },
    {
      color: "#060010",
      title: "100+ Client",
      description: "Kepercayaan dari klien yang puas dengan hasil kerja dan pelayanan yang kami berikan.",
      label: "Clients",
    },
    {
      color: "#060010",
      title: "Nilai Kami", 
      description: "Kreativitas tanpa batas, kolaborasi yang kuat, kualitas profesional, dan inovasi berkelanjutan.",
      label: "Values",
    },
  ];
};

// Custom MagicBento component dengan data About Us dan styling yang diperbesar
const AboutUsBento = ({ 
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 300,
  particleCount = 12,
  enableTilt = true,
  glowColor = "255, 255, 255",
  clickEffect = true,
  enableMagnetism = true 
}) => {
  const aboutData = useAboutUsData();

  return (
    <>
      {/* Custom CSS untuk memperbesar cards dan fonts */}
      <style jsx global>{`
        .about-bento-container .card {
          min-height: 280px !important;
          aspect-ratio: 4/3.5 !important;
          padding: 2rem !important;
        }
        
        .about-bento-container .card__label {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          opacity: 0.9 !important;
        }
        
        .about-bento-container .card__title {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.2 !important;
        }
        
        .about-bento-container .card__description {
          font-size: 1rem !important;
          line-height: 1.6 !important;
          opacity: 0.85 !important;
        }
        
        .about-bento-container .card-responsive {
          gap: 1rem !important;
          width: 100% !important;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
          .about-bento-container .card {
            min-height: 240px !important;
            padding: 1.5rem !important;
          }
          
          .about-bento-container .card__title {
            font-size: 1.5rem !important;
          }
          
          .about-bento-container .card__description {
            font-size: 0.95rem !important;
          }
          
          .about-bento-container .card__label {
            font-size: 1rem !important;
          }
        }
        
        /* Tablet adjustments */
        @media (min-width: 769px) and (max-width: 1024px) {
          .about-bento-container .card {
            min-height: 260px !important;
          }
        }
        
        /* Large screen adjustments */
        @media (min-width: 1200px) {
          .about-bento-container .card {
            min-height: 320px !important;
            padding: 2.5rem !important;
          }
          
          .about-bento-container .card__title {
            font-size: 2rem !important;
          }
          
          .about-bento-container .card__description {
            font-size: 1.125rem !important;
          }
        }
      `}</style>
      
      <div className="about-bento-container">
        <MagicBento
          cardData={aboutData}
          textAutoHide={textAutoHide}
          enableStars={enableStars}
          enableSpotlight={enableSpotlight}
          enableBorderGlow={enableBorderGlow}
          disableAnimations={disableAnimations}
          spotlightRadius={spotlightRadius}
          particleCount={particleCount}
          enableTilt={enableTilt}
          glowColor={glowColor}
          clickEffect={clickEffect}
          enableMagnetism={enableMagnetism}
        />
      </div>
    </>
  );
};

const AboutBentoLayout = () => {
  return (
    <div className="w-full flex justify-center items-center py-12">
      <div className="max-w-8xl mx-auto px-4">
        <AboutUsBento
          textAutoHide={false}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          disableAnimations={false}
          spotlightRadius={350}
          particleCount={18}
          enableTilt={true}
          glowColor="255, 255, 255"
          clickEffect={true}
          enableMagnetism={true}
        />
      </div>
    </div>
  );
};

export default AboutBentoLayout;