// Blog service layer for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const blogService = {
  // Get latest blog posts
  async getLatestPosts(limit = 3) {
    try {
      const response = await fetch(`/api/blog/posts?limit=${limit}&status=published&sort=latest`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get all blog posts (for blog index page)
  async getAllPosts(options = {}) {
    const { page = 1, limit = 12, status = 'published', category = null } = options;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await fetch(`/api/blog/posts?${params}`);
    const data = await response.json();
    return data;
  },

  // Get single blog post
  async getPostBySlug(slug) {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Get blog categories
  async getCategories() {
    const response = await fetch('/api/blog/categories');
    const data = await response.json();
    return data;
  }
};

export default blogService;
