import { NextResponse } from 'next/server';
import { logger, performance } from '../../../../lib/logger';
import { prisma } from '../../../../lib/db.js';

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    logger.info('Blog categories API request', {
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    let categories = [];

    try {
      // Try to fetch from database first
      const dbCategories = await prisma.articleCategory.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          categoryName: 'asc'
        },
        include: {
          _count: {
            select: {
              articles: {
                where: {
                  status: 'published',
                  deletedAt: null
                }
              }
            }
          }
        }
      });

      categories = dbCategories.map(cat => ({
        id: cat.id,
        categoryName: cat.categoryName,
        slug: cat.slug,
        description: cat.description,
        articleCount: cat._count.articles
      }));

    } catch (dbError) {
      logger.warn('Database error, falling back to sample categories', {
        error: dbError.message,
        timestamp: new Date().toISOString()
      });

      // Fallback to sample categories
      categories = [
        { id: 1, categoryName: 'Film Making', slug: 'film-making', description: 'Articles about film production and techniques', articleCount: 1 },
        { id: 2, categoryName: 'Behind the Scenes', slug: 'behind-the-scenes', description: 'Behind the scenes content and production stories', articleCount: 1 },
        { id: 3, categoryName: 'Achievements', slug: 'achievements', description: 'Success stories and achievements', articleCount: 1 },
        { id: 4, categoryName: 'Technical', slug: 'technical', description: 'Technical articles and tutorials', articleCount: 1 },
        { id: 5, categoryName: 'Production', slug: 'production', description: 'Production insights and workflows', articleCount: 1 },
        { id: 6, categoryName: 'Industry', slug: 'industry', description: 'Industry news and trends', articleCount: 1 }
      ];
    }

    const responseTime = Date.now() - startTime;
    performance('Blog Categories API Response', responseTime, {
      totalCategories: categories.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: {
        categories
      },
      meta: {
        status: 'success',
        message: 'Categories fetched successfully'
      }
    });

  } catch (error) {
    logger.error('Blog categories API error', {
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
        message: 'Failed to fetch categories'
      }
    }, { status: 500 });
  }
}