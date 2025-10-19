import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';

/**
 * GET /api/admin/categories
 * Get all article categories
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('Admin categories API request', {
      timestamp: new Date().toISOString(),
    });

    const categories = await prisma.articleCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        categoryName: 'asc'
      },
      select: {
        id: true,
        categoryName: true,
        slug: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            articles: {
              where: {
                status: 'published'
              }
            }
          }
        }
      }
    });

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Categories API Response', responseTime, {
      totalCategories: categories.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          ...cat,
          articleCount: cat._count.articles
        }))
      }
    });

  } catch (error) {
    console.error('Admin categories API error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch categories',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create new article category
 */
export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { categoryName, description } = body;

    console.log('Admin create category request', {
      categoryName,
      timestamp: new Date().toISOString(),
    });

    // Validate required fields
    if (!categoryName || !categoryName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug from category name
    const slug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if category already exists
    const existingCategory = await prisma.articleCategory.findFirst({
      where: {
        OR: [
          { categoryName: categoryName.trim() },
          { slug: slug }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.articleCategory.create({
      data: {
        categoryName: categoryName.trim(),
        slug,
        description: description?.trim() || null
      }
    });

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Create Category Response', responseTime, {
      categoryId: category.id,
      categoryName: category.categoryName,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { category },
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Admin create category error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create category',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
