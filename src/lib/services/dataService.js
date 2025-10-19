// Service layer for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const dataService = {
  // Films API
  async getFilms(options = {}) {
    const { status = 'all', per_page = 50, page = 1 } = options;
    const params = new URLSearchParams({
      status,
      per_page: per_page.toString(),
      page: page.toString()
    });
    
    const response = await fetch(`/api/films?${params}`);
    const data = await response.json();
    return data;
  },

  async getFeaturedFilms(limit = 6) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      status: 'now_showing'
    });
    
    const response = await fetch(`/api/films/featured?${params}`);
    const data = await response.json();
    return data;
  },

  // Cabinet API
  async getCabinetMembers() {
    const response = await fetch('/api/cabinets/active');
    const data = await response.json();
    return data;
  },

  // Content API
  async getPromoContent() {
    const response = await fetch('/api/contents/promo');
    const data = await response.json();
    return data;
  },

  // Utility function to get random posters from uploads
  async getAvailablePosters() {
    // This could be expanded to fetch from an API endpoint
    // For now, returning a simplified list
    const posterFiles = [
      '/uploads/1758954623342-jqnx11xrb3o.png',
      '/uploads/1758954779106-aw1kghckqi.jpg',
      '/uploads/1758955486705-ywjuzdh6g7.jpg',
      '/uploads/1759118814366-js75a7ko6t.png',
      '/uploads/1759118946775-vyowpv1hpbe.png',
      '/uploads/1759197674705-rq3fy0fsic.png'
    ];
    
    // Shuffle and return random posters
    const shuffled = [...posterFiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }
};

export default dataService;
