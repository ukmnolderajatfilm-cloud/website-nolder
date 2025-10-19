import { NextResponse } from 'next/server';
import { logger, performance } from '../../../../lib/logger';
import { prisma } from '../../../../lib/db.js';

// Fallback sample blog posts data
const sampleBlogPosts = [
  {
    id: 1,
    title: 'The Art of Cinematic Storytelling',
    slug: 'art-of-cinematic-storytelling',
    excerpt: 'Explore the fundamental techniques that make a film truly memorable and impactful. From character development to visual composition, learn how great directors craft compelling narratives.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1758954623342-jqnx11xrb3o.png',
    author: 'Nol Derajat Film',
    category: 'Film Making',
    readTime: '5 min read',
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Behind the Scenes: Our Latest Production',
    slug: 'behind-the-scenes-latest-production',
    excerpt: 'Take a look at the creative process behind our most recent film project. Discover the challenges, triumphs, and lessons learned during production.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1758954779106-aw1kghckqi.jpg',
    author: 'Nol Derajat Film',
    category: 'Behind the Scenes',
    readTime: '3 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: 'Film Festival Success Stories',
    slug: 'film-festival-success-stories',
    excerpt: 'Celebrating our achievements and recognition in various film festivals. Learn about the journey from submission to acceptance and the impact on our creative community.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1758955486705-ywjuzdh6g7.jpg',
    author: 'Nol Derajat Film',
    category: 'Achievements',
    readTime: '4 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    title: 'Cinematic Lighting Techniques',
    slug: 'cinematic-lighting-techniques',
    excerpt: 'Master the art of lighting in film production. From natural light to artificial setups, discover how lighting shapes mood and narrative.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1759118814366-js75a7ko6t.png',
    author: 'Nol Derajat Film',
    category: 'Technical',
    readTime: '6 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    title: 'Collaboration in Film Production',
    slug: 'collaboration-in-film-production',
    excerpt: 'The importance of teamwork and collaboration in creating successful films. Learn how different roles work together to bring a vision to life.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1759118946775-vyowpv1hpbe.png',
    author: 'Nol Derajat Film',
    category: 'Production',
    readTime: '4 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 6,
    title: 'The Future of Independent Filmmaking',
    slug: 'future-of-independent-filmmaking',
    excerpt: 'Exploring emerging trends and technologies that are shaping the future of independent filmmaking and creative expression.',
    content: 'Full article content would go here...',
    featuredImage: '/uploads/1759197674705-rq3fy0fsic.png',
    author: 'Nol Derajat Film',
    category: 'Industry',
    readTime: '7 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString()
  }
];

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 12;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'latest';

    // Log API request
    logger.info('Blog posts API request', {
      limit,
      page,
      status,
      category,
      sort,
      ip: request.ip,
      userAgent: request.headers.get('user-agent')
    });

    let posts = [];
    let totalPosts = 0;
    let totalPages = 0;

    try {
      // Try to fetch from database first
      const where = {
        deletedAt: null,
        status: status
      };

      // Add category filter if provided
      if (category) {
        where.category = {
          slug: category
        };
      }

      // Get total count
      totalPosts = await prisma.article.count({ where });

      // Get articles with pagination
      const articles = await prisma.article.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              categoryName: true,
              slug: true
            }
          },
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        },
        orderBy: {
          publishedAt: sort === 'oldest' ? 'asc' : 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      });

      // Transform articles to match expected format
      posts = articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        featuredImage: article.bannerImage || '',
        author: article.admin.name || article.admin.username || 'Nol Derajat Film',
        category: article.category.categoryName,
        readTime: article.readTime ? `${article.readTime} min read` : '5 min read',
        status: article.status,
        publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString()
      }));

      totalPages = Math.ceil(totalPosts / limit);

    } catch (dbError) {
      logger.warn('Database error, falling back to sample data', {
        error: dbError.message,
        timestamp: new Date().toISOString()
      });

      // Fallback to sample data
      let filteredPosts = sampleBlogPosts.filter(post => post.status === status);

      // Filter by category if provided
      if (category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Sort posts
      if (sort === 'latest') {
        filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      } else if (sort === 'oldest') {
        filteredPosts.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      posts = filteredPosts.slice(startIndex, endIndex);

      // Calculate pagination info
      totalPosts = filteredPosts.length;
      totalPages = Math.ceil(totalPosts / limit);
    }

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const responseTime = Date.now() - startTime;
    performance('Blog Posts API Response', responseTime, {
      totalPosts,
      returnedPosts: posts.length,
      page,
      limit,
      category
    });

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNextPage,
          hasPrevPage,
          limit
        }
      },
      meta: {
        status: 'success',
        message: 'Blog posts fetched successfully'
      }
    });

  } catch (error) {
    logger.error('Blog posts API error', {
      error: error.message,
      stack: error.stack,
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: false,
      data: null,
      meta: {
        status: 'error',
        message: 'Failed to fetch blog posts'
      }
    }, { status: 500 });
  }
}
