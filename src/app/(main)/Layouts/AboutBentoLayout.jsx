'use client';

import React from 'react';
import SpotlightCard from '../Components/SpotlightCard/SpotlightCard';

// Data untuk visi misi dan informasi perusahaan
const aboutData = [
  {
    id: 'vision',
    title: "Visi Kami",
    description: "Menjadi wadah kreatif terdepan yang menghubungkan cerita dengan emosi, menciptakan karya sinematik yang memberikan dampak positif bagi masyarakat dan industri perfilman Indonesia.",
    label: "VISION",
    icon: "🎯"
  },
  {
    id: 'mission',
    title: "Misi Kami", 
    description: "Mengembangkan talenta filmmaker lokal, memproduksi konten berkualitas tinggi, dan membangun ekosistem kreatif berkelanjutan yang mendorong inovasi dalam dunia perfilman.",
    label: "MISSION",
    icon: "🚀"
  },
  
 
];

const AboutBentoLayout = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutData.map((item, index) => (
            <SpotlightCard 
              key={item.id}
              className={`${
                // Visi dan Misi cards yang lebih besar
                (item.id === 'vision' || item.id === 'mission') 
                  ? 'md:col-span-2 lg:col-span-1' 
                  : ''
              } ${
                // Values card mengambil full width di mobile
                item.id === 'values' 
                  ? 'md:col-span-2 lg:col-span-3' 
                  : ''
              }`}
              spotlightColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="flex flex-col h-full">
                {/* Header dengan Icon dan Label */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-gray-400 tracking-wider">
                    {item.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed flex-grow">
                  {item.description}
                </p>

                {/* Stats highlight untuk cards dengan angka */}
                {(item.id === 'experience' || item.id === 'projects' || item.id === 'clients') && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-3xl font-bold text-white mb-1">
                      {item.title.split(' ')[0]}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.title.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Call to Action */}
        
      </div>
    </div>
  );
};

export default AboutBentoLayout;