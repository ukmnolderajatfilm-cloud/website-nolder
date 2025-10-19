import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/blogService';

// Custom hook for latest blog posts
export function useLatestBlogPosts(limit = 3) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getLatestPosts(limit);
      
      if (response.success) {
        // Transform posts data to include proper formatting
        const transformedPosts = response.data.posts.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
          featuredImage: post.featuredImage || post.image || '/images/default-blog.jpg',
          slug: post.slug,
          publishedAt: post.publishedAt || post.createdAt,
          author: post.author || 'Nol Derajat Film',
          category: post.category || 'General',
          readTime: post.readTime || '5 min read'
        }));
        
        setPosts(transformedPosts);
      } else {
        throw new Error(response.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching latest blog posts:', err);
      
      // Fallback to sample posts for development
      const samplePosts = [
        {
          id: 1,
          title: 'The Art of Cinematic Storytelling',
          excerpt: 'Explore the fundamental techniques that make a film truly memorable and impactful...',
          featuredImage: '/uploads/1758954623342-jqnx11xrb3o.png',
          slug: 'art-of-cinematic-storytelling',
          publishedAt: new Date().toISOString(),
          author: 'Nol Derajat Film',
          category: 'Film Making',
          readTime: '5 min read'
        },
        {
          id: 2,
          title: 'Behind the Scenes: Our Latest Production',
          excerpt: 'Take a look at the creative process behind our most recent film project...',
          featuredImage: '/uploads/1758954779106-aw1kghckqi.jpg',
          slug: 'behind-the-scenes-latest-production',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          author: 'Nol Derajat Film',
          category: 'Behind the Scenes',
          readTime: '3 min read'
        },
        {
          id: 3,
          title: 'Film Festival Success Stories',
          excerpt: 'Celebrating our achievements and recognition in various film festivals...',
          featuredImage: '/uploads/1758955486705-ywjuzdh6g7.jpg',
          slug: 'film-festival-success-stories',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          author: 'Nol Derajat Film',
          category: 'Achievements',
          readTime: '4 min read'
        }
      ];
      
      setPosts(samplePosts.slice(0, limit));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  return { posts, loading, error, refetch: fetchLatestPosts };
}

// Custom hook for all blog posts
export function useBlogPosts(options = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getAllPosts(options);
      
      if (response.success) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
}
