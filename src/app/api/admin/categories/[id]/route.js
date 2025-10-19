import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db.js';
import { logger } from '../../../../../lib/logger.js';

/**
 * GET /api/admin/categories/[id]
 * Get single article category
 */
export async function GET(request, { params }) {
  const startTime = Date.now();
  const { id } = params;
  
  try {
    logger.info('Admin get category request', {
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    const category = await prisma.articleCategory.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const responseTime = Date.now() - startTime;
    
    logger.performance('Admin Get Category Response', responseTime, {
      categoryId: category.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        category: {
          ...category,
          articleCount: category._count.articles
        }
      }
    });

  } catch (error) {
    logger.error('Admin get category error', {
      error: error.message,
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch category',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/categories/[id]
 * Update article category
 */
export async function PUT(request, { params }) {
  const startTime = Date.now();
  const { id } = params;
  
  try {
    const body = await request.json();
    const { categoryName, description, isActive } = body;

    logger.info('Admin update category request', {
      categoryId: id,
      categoryName,
      timestamp: new Date().toISOString(),
    });

    // Check if category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!categoryName || !categoryName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate new slug if category name changed
    let slug = existingCategory.slug;
    if (categoryName !== existingCategory.categoryName) {
      slug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Check if new slug already exists
      const slugExists = await prisma.articleCategory.findFirst({
        where: {
          slug,
          id: { not: parseInt(id) }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: 'Category name already exists' },
          { status: 409 }
        );
      }
    }

    const category = await prisma.articleCategory.update({
      where: { id: parseInt(id) },
      data: {
        categoryName: categoryName.trim(),
        slug,
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive
      }
    });

    const responseTime = Date.now() - startTime;
    
    logger.performance('Admin Update Category Response', responseTime, {
      categoryId: category.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { category },
      message: 'Category updated successfully'
    });

  } catch (error) {
    logger.error('Admin update category error', {
      error: error.message,
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update category',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete article category
 */
export async function DELETE(request, { params }) {
  const startTime = Date.now();
  const { id } = params;
  
  try {
    logger.info('Admin delete category request', {
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    // Check if category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has articles
    if (existingCategory._count.articles > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete category with existing articles. Please move or delete articles first.' 
        },
        { status: 409 }
      );
    }

    await prisma.articleCategory.delete({
      where: { id: parseInt(id) }
    });

    const responseTime = Date.now() - startTime;
    
    logger.performance('Admin Delete Category Response', responseTime, {
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    logger.error('Admin delete category error', {
      error: error.message,
      categoryId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete category',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
