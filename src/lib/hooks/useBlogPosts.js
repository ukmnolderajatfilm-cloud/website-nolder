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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
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
        },
        {
          id: 4,
          title: 'Cinematic Lighting Techniques',
          excerpt: 'Master the art of lighting in film production. From natural light to artificial setups...',
          featuredImage: '/uploads/1759118814366-js75a7ko6t.png',
          slug: 'cinematic-lighting-techniques',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          author: 'Nol Derajat Film',
          category: 'Technical',
          readTime: '6 min read'
        },
        {
          id: 5,
          title: 'Collaboration in Film Production',
          excerpt: 'The importance of teamwork and collaboration in creating successful films...',
          featuredImage: '/uploads/1759118946775-vyowpv1hpbe.png',
          slug: 'collaboration-in-film-production',
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          author: 'Nol Derajat Film',
          category: 'Production',
          readTime: '4 min read'
        },
        {
          id: 6,
          title: 'The Future of Independent Filmmaking',
          excerpt: 'Exploring emerging trends and technologies that are shaping the future...',
          featuredImage: '/uploads/1759197674705-rq3fy0fsic.png',
          slug: 'future-of-independent-filmmaking',
          publishedAt: new Date(Date.now() - 432000000).toISOString(),
          author: 'Nol Derajat Film',
          category: 'Industry',
          readTime: '7 min read'
        }
      ];
      
      // Filter by category if specified
      let filteredPosts = samplePosts;
      if (options.category) {
        filteredPosts = samplePosts.filter(post => 
          post.category.toLowerCase() === options.category.toLowerCase()
        );
      }
      
      // Pagination
      const page = options.page || 1;
      const limit = options.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      setPosts(paginatedPosts);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        hasNextPage: page < Math.ceil(filteredPosts.length / limit),
        hasPrevPage: page > 1,
        limit
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [options.page, options.limit, options.category, options.status, options.sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { 
    posts, 
    pagination, 
    loading, 
    error, 
    isRefreshing,
    refetch: () => fetchPosts(true) 
  };
}
