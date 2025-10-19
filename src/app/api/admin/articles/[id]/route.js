import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db.js';
import { validateAdminAuth, validateArticleOwnership } from '../../../../../lib/auth.js';

/**
 * GET /api/admin/articles/[id]
 * Get single article
 */
export async function GET(request, { params }) {
  const startTime = Date.now();
  const { id } = await params;
  
  try {
    // Validasi authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: authResult.error },
        { status: 401 }
      );
    }

    // Validasi ownership artikel
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Forbidden', error: ownershipResult.error },
        { status: 403 }
      );
    }

    console.log('Admin get article request', {
      articleId: id,
      adminId: authResult.adminId,
      timestamp: new Date().toISOString(),
    });

    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
        deletedAt: null
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

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Get Article Response', responseTime, {
      articleId: article.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { article }
    });

  } catch (error) {
    console.error('Admin get article error', {
      error: error.message,
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/articles/[id]
 * Update article
 */
export async function PUT(request, { params }) {
  const startTime = Date.now();
  const { id } = await params;
  
  try {
    // Validasi authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: authResult.error },
        { status: 401 }
      );
    }

    // Validasi ownership artikel
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Forbidden', error: ownershipResult.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      excerpt, 
      content, 
      bannerImage, 
      categoryId, 
      status 
    } = body;

    console.log('Admin update article request', {
      articleId: id,
      adminId: authResult.adminId,
      title,
      categoryId,
      status,
      timestamp: new Date().toISOString(),
    });

    // Check if article exists (sudah divalidasi di ownership check)
    const existingArticle = ownershipResult.article;

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

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (title !== existingArticle.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Check if new slug already exists
      const slugExists = await prisma.article.findFirst({
        where: {
          slug,
          id: { not: parseInt(id) },
          deletedAt: null
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: 'An article with this title already exists' },
          { status: 409 }
        );
      }
    }

    // Calculate read time
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Determine publishedAt
    let publishedAt = existingArticle.publishedAt;
    if (status === 'published' && existingArticle.status !== 'published') {
      publishedAt = new Date();
    } else if (status !== 'published' && existingArticle.status === 'published') {
      publishedAt = null;
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        bannerImage: bannerImage?.trim() || null,
        status: status || existingArticle.status,
        categoryId: parseInt(categoryId),
        readTime,
        publishedAt
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
    
    console.log('Admin Update Article Response', responseTime, {
      articleId: article.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Admin update article error', {
      error: error.message,
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * Soft delete article
 */
export async function DELETE(request, { params }) {
  const startTime = Date.now();
  const { id } = await params;
  
  try {
    // Validasi authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: authResult.error },
        { status: 401 }
      );
    }

    // Validasi ownership artikel
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Forbidden', error: ownershipResult.error },
        { status: 403 }
      );
    }

    console.log('Admin delete article request', {
      articleId: id,
      adminId: authResult.adminId,
      timestamp: new Date().toISOString(),
    });

    // Check if article exists (sudah divalidasi di ownership check)
    const existingArticle = ownershipResult.article;

    // Soft delete
    await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        deletedAt: new Date()
      }
    });

    const responseTime = Date.now() - startTime;
    
    console.log('Admin Delete Article Response', responseTime, {
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete article error', {
      error: error.message,
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
