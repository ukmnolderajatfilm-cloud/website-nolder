import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-16 sm:py-20">
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-yellow-400 absolute top-0 left-0"></div>
        </div>
        <motion.p 
          className="text-gray-300 text-sm sm:text-base font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
