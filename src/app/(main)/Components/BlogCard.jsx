import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const BlogCard = ({ post }) => {
  // Configure marked for better HTML output
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });

  // Function to render content with proper formatting (same as in blog detail page)
  const renderFormattedContent = (content) => {
    if (!content) return '';
    
    // Pre-process content to fix common markdown issues
    let processedContent = content
      // Fix bold text with spaces: **text ** -> **text**
      .replace(/\*\*([^*]+?)\s+\*\*/g, '**$1**')
      // Fix italic text with spaces: *text * -> *text*
      .replace(/\*([^*]+?)\s+\*/g, '*$1*')
      // Fix heading text that might not be properly formatted
      .replace(/^###\s+(.+)$/gm, '### $1')
      .replace(/^##\s+(.+)$/gm, '## $1')
      .replace(/^#\s+(.+)$/gm, '# $1');
    
    // Convert markdown to HTML
    let html = marked(processedContent);
    
    // Post-process HTML for custom formatting
    html = html
      // Handle text alignment (keep existing prose styling)
      .replace(/<div class="text-(left|center|right|justify)">(.*?)<\/div>/g, '<div class="text-$1">$2</div>')
      // Handle underline text (keep existing prose styling)
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>')
      // Ensure any remaining **text** gets converted to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Ensure any remaining *text* gets converted to <em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Ensure headings are properly styled
      .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-4xl font-bold text-yellow-400 my-6">$1</h1>')
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-3xl font-bold text-yellow-400 my-5">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-2xl font-semibold text-yellow-400 my-4">$1</h3>');
    
    return html;
  };

  // Function to create clean excerpt from content
  const createCleanExcerpt = (content) => {
    if (!content) return '';
    
    // First render the formatted content
    const formattedHtml = renderFormattedContent(content);
    
    // Strip HTML tags and get plain text
    const plainText = formattedHtml.replace(/<[^>]*>/g, '');
    
    // Return first 150 characters with ellipsis
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <motion.article
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 overflow-hidden group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-yellow-500/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        {/* Featured Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 text-xs font-semibold">
              {post.category}
            </span>
          </div>
          
          {/* Read Time Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.content ? createCleanExcerpt(post.content) : post.excerpt}
          </p>
          
          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{post.author}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/30 rounded-2xl transition-all duration-500 pointer-events-none" />
      </motion.article>
    </Link>
  );
};

export default BlogCard;
