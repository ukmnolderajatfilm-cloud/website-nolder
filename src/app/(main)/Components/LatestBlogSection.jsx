import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLatestBlogPosts } from '../../../lib/hooks/useBlogPosts';
import BlogCard from './BlogCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const LatestBlogSection = () => {
  const { posts, loading, error, refetch } = useLatestBlogPosts(3);

  return (
    <section id="blog" className="relative py-32 px-8 sm:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 tracking-wider">
            ARTIKEL TERBARU
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8" />
          <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-4xl mx-auto">
            Eksplorasi wawasan sinematik, cerita di balik layar, dan inspirasi kreatif dari Nol Derajat Film
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="mb-16">
          {loading ? (
            <LoadingSpinner message="Loading latest articles..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={refetch} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Call-to-Action Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Link
            href="/blog"
            className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl font-bold text-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 overflow-hidden inline-block"
          >
            {/* Button Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button Content */}
            <div className="relative flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>LIHAT SEMUA ARTIKEL</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-600 rounded-tl-2xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-600 rounded-br-2xl opacity-50" />
          </Link>
          
          <motion.p 
            className="text-gray-400 text-sm mt-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Jelajahi koleksi lengkap artikel dan wawasan sinematik
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestBlogSection;
