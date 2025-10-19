import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';

/**
 * GET /api/admin/articles
 * Get all articles with filtering and pagination
 */
export async function GET(request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  try {
    // Parse query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('Admin articles API request', {
      page,
      limit,
      search,
      status,
      categoryId,
      sortBy,
      sortOrder,
      timestamp: new Date().toISOString(),
    });

    // Build where clause
    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { content: { contains: search } }
        ]
      }),
      ...(status && { status }),
      ...(categoryId && { categoryId: parseInt(categoryId) })
    };

    // Get total count
    const totalArticles = await prisma.article.count({ where });

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
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });

    const totalPages = Math.ceil(totalArticles / limit);

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Articles API Response', responseTime, {
      totalArticles,
      returnedArticles: articles.length,
      page,
      limit,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: page,
          totalPages,
          totalArticles,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Admin articles API error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch articles',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/articles
 * Create new article
 */
export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { 
      title, 
      excerpt, 
      content, 
      bannerImage, 
      categoryId, 
      status = 'draft',
      adminId = 1 // TODO: Get from auth session
    } = body;

    console.log('Admin create article request', {
      title,
      categoryId,
      status,
      timestamp: new Date().toISOString(),
    });

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'Category is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.articleCategory.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { success: false, message: 'An article with this title already exists' },
        { status: 409 }
      );
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        bannerImage: bannerImage?.trim() || null,
        status,
        categoryId: parseInt(categoryId),
        adminId: parseInt(adminId),
        readTime,
        publishedAt: status === 'published' ? new Date() : null
      },
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
      }
    });

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Create Article Response', responseTime, {
      articleId: article.id,
      title: article.title,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article created successfully'
    });

  } catch (error) {
    console.error('Admin create article error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
