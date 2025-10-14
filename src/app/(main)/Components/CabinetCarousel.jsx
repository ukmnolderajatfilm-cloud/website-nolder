'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from './ProfileCard';

const CabinetCarousel = () => {
  const [currentDivision, setCurrentDivision] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cabinetData, setCabinetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active cabinet data from API and process images
  useEffect(() => {
    const fetchActiveCabinet = async () => {
      try {
        const response = await fetch('/api/cabinets/active');
        const data = await response.json();
        
        if (data.success && data.cabinet) {
          // Process images with background removal
          const processedCabinet = await processImagesWithBgRemoval(data.cabinet);
          setCabinetData(processedCabinet);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveCabinet();
  }, []);

  // Process all member images with background removal
  const processImagesWithBgRemoval = async (cabinet) => {
    if (!cabinet.members || cabinet.members.length === 0) {
      return cabinet;
    }

    // Check if Remove.bg is enabled (skip if no API key for faster dev)
    // Comment this block to always try processing
    const skipBgRemoval = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_BG_REMOVAL;
    
    if (skipBgRemoval) {
      return cabinet;
    }


    // Process all images in parallel
    const processedMembers = await Promise.all(
      cabinet.members.map(async (member) => {
        if (!member.image || member.image === '/Images/nolder-logo.png') {
          return member;
        }

        try {
          // Call background removal API
          const formData = new FormData();
          formData.append('imageUrl', member.image);

          const response = await fetch('/api/remove-bg', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();

          if (result.success && result.processedUrl && result.processedUrl !== member.image) {
            return {
              ...member,
              image: result.processedUrl,
              originalImage: member.image // Keep original as backup
            };
          }

          return member;
        } catch (error) {
          return member; // Return original on error
        }
      })
    );

    return {
      ...cabinet,
      members: processedMembers
    };
  };

  // Process cabinet data into divisions structure
  const getDivisionsFromData = () => {
    if (!cabinetData || !cabinetData.members) {
      return [];
    }

    // Group members by division
    const divisionMap = {};
    
    cabinetData.members.forEach(member => {
      const divisionCode = member.division?.code || 'unknown';
      const divisionName = member.division?.name || 'Unknown Division';
      
      // Gabungkan ketua_umum, wakil_ketua_umum, dan leadership jadi satu divisi "leadership"
      let finalDivisionCode = divisionCode;
      let finalDivisionName = divisionName;
      let finalSubtitle = member.division?.description || '';
      
      if (divisionCode === 'ketua_umum' || divisionCode === 'wakil_ketua_umum' || divisionCode === 'leadership') {
        finalDivisionCode = 'leadership';
        finalDivisionName = 'KETUA & WAKIL KETUA';
        finalSubtitle = 'Leadership Team';
      }
      
      if (!divisionMap[finalDivisionCode]) {
        divisionMap[finalDivisionCode] = {
          id: finalDivisionCode,
          title: finalDivisionName.toUpperCase(),
          subtitle: finalSubtitle,
          members: []
        };
      }
      
      divisionMap[finalDivisionCode].members.push({
        name: member.name,
        title: member.position,
        handle: member.name.toLowerCase().replace(/\s+/g, ''),
        status: member.description || 'Member',
        avatarUrl: member.image || '/Images/nolder-logo.png',
        miniAvatarUrl: member.image || '/Images/nolder-logo.png'
      });
    });

    // Define division order and colors
    const divisionOrder = ['leadership', 'anf', 'psdi', 'psdm', 'produksi', 'humi', 'dea'];
    const divisionColors = {
      leadership: { color: 'from-yellow-400 to-yellow-600', accentColor: 'rgba(251, 191, 36, 0.3)' },
      anf: { color: 'from-blue-400 to-blue-600', accentColor: 'rgba(59, 130, 246, 0.3)' },
      psdi: { color: 'from-purple-400 to-purple-600', accentColor: 'rgba(168, 85, 247, 0.3)' },
      psdm: { color: 'from-green-400 to-green-600', accentColor: 'rgba(34, 197, 94, 0.3)' },
      produksi: { color: 'from-red-400 to-red-600', accentColor: 'rgba(239, 68, 68, 0.3)' },
      humi: { color: 'from-indigo-400 to-indigo-600', accentColor: 'rgba(99, 102, 241, 0.3)' },
      dea: { color: 'from-pink-400 to-pink-600', accentColor: 'rgba(236, 72, 153, 0.3)' }
    };

    // Sort divisions by predefined order
    const sortedDivisions = divisionOrder
      .filter(code => divisionMap[code] && divisionMap[code].members.length > 0)
      .map(code => ({
        ...divisionMap[code],
        ...divisionColors[code]
      }));

    return sortedDivisions;
  };

  const divisions = getDivisionsFromData();

  // Fallback divisions if no data from database
  const fallbackDivisions = [
    {
      id: 'leadership',
      title: 'KETUA & WAKIL KETUA',
      subtitle: 'Leadership Team',
      color: 'from-yellow-400 to-yellow-600',
      accentColor: 'rgba(251, 191, 36, 0.3)',
      members: [
        {
          name: "Ahmad Rizki",
          title: "Ketua CINEVERSO",
          handle: "ahmadrizki",
          status: "Leading the Vision",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Sari Indah",
          title: "Wakil Ketua CINEVERSO",
          handle: "sariindah",
          status: "Strategy & Operations",
          avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'anf',
      title: 'ANF',
      subtitle: 'Administration & Finance',
      color: 'from-blue-400 to-blue-600',
      accentColor: 'rgba(59, 130, 246, 0.3)',
      members: [
        {
          name: "Budi Santoso",
          title: "Koordinator ANF",
          handle: "budisantoso",
          status: "Managing Finances",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Citra Dewi",
          title: "Staff ANF",
          handle: "citradewi",
          status: "Administration Expert",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Doni Pratama",
          title: "Staff ANF",
          handle: "donipratama",
          status: "Financial Analyst",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'psdi',
      title: 'PSDI',
      subtitle: 'Public Relations & Information',
      color: 'from-purple-400 to-purple-600',
      accentColor: 'rgba(168, 85, 247, 0.3)',
      members: [
        {
          name: "Eka Putri",
          title: "Koordinator PSDI",
          handle: "ekaputri",
          status: "PR Specialist",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Farid Akmal",
          title: "Staff PSDI",
          handle: "faridakmal",
          status: "Content Creator",
          avatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Gina Sari",
          title: "Staff PSDI",
          handle: "ginasari",
          status: "Social Media Manager",
          avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'psdm',
      title: 'PSDM',
      subtitle: 'Human Resource Development',
      color: 'from-green-400 to-green-600',
      accentColor: 'rgba(34, 197, 94, 0.3)',
      members: [
        {
          name: "Hadi Wijaya",
          title: "Koordinator PSDM",
          handle: "hadiwijaya",
          status: "HR Specialist",
          avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Indira Maya",
          title: "Staff PSDM",
          handle: "indiramaya",
          status: "Training Coordinator",
          avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Joko Susilo",
          title: "Staff PSDM",
          handle: "jokosusilo",
          status: "Development Expert",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'produksi',
      title: 'PRODUKSI',
      subtitle: 'Film Production Team',
      color: 'from-red-400 to-red-600',
      accentColor: 'rgba(239, 68, 68, 0.3)',
      members: [
        {
          name: "Karina Lestari",
          title: "Koordinator Produksi",
          handle: "karinalestari",
          status: "Production Manager",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Leo Pratama",
          title: "Staff Produksi",
          handle: "leopratama",
          status: "Director",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Maya Sari",
          title: "Staff Produksi",
          handle: "mayasari",
          status: "Cinematographer",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'humi',
      title: 'HUMI',
      subtitle: 'Public Relations & External Affairs',
      color: 'from-indigo-400 to-indigo-600',
      accentColor: 'rgba(99, 102, 241, 0.3)',
      members: [
        {
          name: "Nina Anggraini",
          title: "Koordinator HUMI",
          handle: "ninaanggraini",
          status: "External Relations",
          avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Oscar Ramadhan",
          title: "Staff HUMI",
          handle: "oscarramadhan",
          status: "Partnership Manager",
          avatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Putri Maharani",
          title: "Staff HUMI",
          handle: "putrimaharani",
          status: "Event Coordinator",
          avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Qori Fadhil",
          title: "Staff HUMI",
          handle: "qorifadhil",
          status: "Community Liaison",
          avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 'dea',
      title: 'DEA',
      subtitle: 'Design & Creative Arts',
      color: 'from-pink-400 to-pink-600',
      accentColor: 'rgba(236, 72, 153, 0.3)',
      members: [
        {
          name: "Rina Safitri",
          title: "Koordinator DEA",
          handle: "rinasafitri",
          status: "Creative Director",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Satrio Wibowo",
          title: "Staff DEA",
          handle: "satriowibowo",
          status: "Graphic Designer",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        },
        {
          name: "Tari Kusuma",
          title: "Staff DEA",
          handle: "tarikusuma",
          status: "UI/UX Designer",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
          miniAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
        }
      ]
    }
  ];

  const nextDivision = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const activeDivisions = divisions.length > 0 ? divisions : fallbackDivisions;
    setCurrentDivision((prev) => (prev + 1) % activeDivisions.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevDivision = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const activeDivisions = divisions.length > 0 ? divisions : fallbackDivisions;
    setCurrentDivision((prev) => (prev - 1 + activeDivisions.length) % activeDivisions.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const activeDivisions = divisions.length > 0 ? divisions : fallbackDivisions;
  const currentDiv = activeDivisions[currentDivision];

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Futuristic Navigation Controls */}
      <div className="flex items-center justify-between mb-12">
        {/* Left Arrow */}
        <motion.button
          onClick={prevDivision}
          disabled={isAnimating}
          className="group relative p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-400/30 rounded-xl hover:border-yellow-400/60 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Arrow Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Arrow Icon */}
          <div className="relative z-10 w-8 h-8 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>

          {/* Futuristic Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-xl" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400/50 rounded-br-xl" />
        </motion.button>

        {/* Division Title & Counter */}
        <div className="text-center flex-1 mx-8">
          <motion.div
            key={currentDivision}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <h3 className={`text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentDiv.color} tracking-wider`}>
              {currentDiv.title}
            </h3>
            <p className="text-gray-400 text-lg font-light">
              {currentDiv.subtitle}
            </p>
            
            {/* Division Counter */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              {activeDivisions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isAnimating && setCurrentDivision(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentDivision 
                      ? 'bg-yellow-400 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Arrow */}
        <motion.button
          onClick={nextDivision}
          disabled={isAnimating}
          className="group relative p-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-400/30 rounded-xl hover:border-yellow-400/60 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Arrow Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Arrow Icon */}
          <div className="relative z-10 w-8 h-8 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Futuristic Corner Accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400/50 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400/50 rounded-bl-xl" />
        </motion.button>
      </div>

      {/* Profile Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDivision}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`grid gap-6 ${
            currentDiv.members.length === 2 
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : currentDiv.members.length === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {currentDiv.members.map((member, index) => (
            <motion.div
              key={`${currentDivision}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProfileCard
                name={member.name}
                title={member.title}
                handle={member.handle}
                status={member.status}
                contactText="Contact"
                avatarUrl={member.avatarUrl}
                miniAvatarUrl={member.miniAvatarUrl}
                showUserInfo={false}
                enableTilt={true}
                enableMobileTilt={false}
                divisionColor={currentDiv.color}
                onContactClick={() => {}}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Division Progress Bar */}
      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-md h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${currentDiv.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentDivision + 1) / activeDivisions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CabinetCarousel;
