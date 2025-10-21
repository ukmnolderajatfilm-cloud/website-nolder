'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { marked } from 'marked';
import { blogService } from '../../../lib/services/blogService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure marked for better HTML output
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });

  // Function to render content with proper formatting
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogService.getPostBySlug(params.slug);
        
        if (response.success && response.data && response.data.post) {
          setPost(response.data.post);
          
          // Fetch related posts
          try {
            const relatedResponse = await blogService.getAllPosts({
              limit: 3,
              category: response.data.post.category?.toLowerCase().replace(' ', '-')
            });
            
            if (relatedResponse.success) {
              const filtered = relatedResponse.data.posts.filter(p => p.slug !== params.slug);
              setRelatedPosts(filtered.slice(0, 3));
            }
          } catch (relatedError) {
            console.warn('Failed to fetch related posts:', relatedError);
            // Don't throw error for related posts
          }
        } else {
          throw new Error(response.meta?.message || 'Post not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'spotify':
        // Spotify doesn't have direct sharing, so we'll open their main page
        shareUrl = 'https://open.spotify.com/show/2UliwnxtqJbnVDTVCujoqK?si=884aebb838764730';
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so we'll open their main page
        shareUrl = 'https://www.instagram.com/nolderajatfilm';
        break;
      case 'tiktok':
        // TikTok doesn't have direct URL sharing, so we'll open their main page
        shareUrl = 'https://www.tiktok.com/';
        break;
      case 'youtube':
        // YouTube doesn't have direct URL sharing, so we'll open their main page
        shareUrl = 'https://www.youtube.com/@NolDerajatFilm';
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Loading article..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ErrorMessage 
          message={error || 'Article not found'} 
          onRetry={() => router.push('/blog')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <section className="relative py-20 px-8 sm:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-yellow-400 font-medium truncate">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <motion.header
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className="px-4 py-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-semibold">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleShare('spotify')}
                className="p-3 bg-gray-800/50 hover:bg-green-500/20 border border-gray-700 hover:border-green-500/50 rounded-full transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </button>
              
              <button
                onClick={() => handleShare('instagram')}
                className="p-3 bg-gray-800/50 hover:bg-pink-500/20 border border-gray-700 hover:border-pink-500/50 rounded-full transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              
              <button
                onClick={() => handleShare('tiktok')}
                className="p-3 bg-gray-800/50 hover:bg-white/20 border border-gray-700 hover:border-black/50 rounded-full transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </button>
              
              <button
                onClick={() => handleShare('youtube')}
                className="p-3 bg-gray-800/50 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 rounded-full transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>
          </motion.header>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-8 sm:px-20 mb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="px-8 sm:px-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="blog-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Display actual content from database with custom formatting */}
            <div 
              className="prose prose-invert prose-lg max-w-none text-white prose-headings:text-yellow-400 prose-headings:font-bold prose-p:text-gray-200 prose-p:leading-relaxed prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-semibold prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:text-gray-200 prose-blockquote:border-l-yellow-400 prose-blockquote:bg-gray-800/30 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300 prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:my-8"
              dangerouslySetInnerHTML={{ 
                __html: post.content ? renderFormattedContent(post.content) : 'No content available'
              }}
            />
          </motion.div>

        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-8 sm:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-12 text-center">
                Artikel Terkait
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/blog/${relatedPost.slug}`} className="block group">
                      <article className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 overflow-hidden group-hover:scale-105">
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                            {relatedPost.content ? renderFormattedContent(relatedPost.content).replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No description available'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{relatedPost.category}</span>
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Back to Blog Button */}
      <section className="px-8 sm:px-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl font-bold text-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Blog</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
