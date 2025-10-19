import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/db.js';
import { validateAdminAuth, validateArticleOwnership } from '../../../../../../lib/auth.js';

/**
 * POST /api/admin/articles/[id]/publish
 * Publish article
 */
export async function POST(request, { params }) {
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

    console.log('Admin publish article request', {
      articleId: id,
      adminId: authResult.adminId,
      timestamp: new Date().toISOString(),
    });

    // Check if article exists (sudah divalidasi di ownership check)
    const existingArticle = ownershipResult.article;

    if (existingArticle.status === 'published') {
      return NextResponse.json(
        { success: false, message: 'Article is already published' },
        { status: 400 }
      );
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        status: 'published',
        publishedAt: new Date()
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
    
    console.log('Admin Publish Article Response', responseTime, {
      articleId: article.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article published successfully'
    });

  } catch (error) {
    console.error('Admin publish article error', {
      error: error.message,
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to publish article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]/publish
 * Unpublish article
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

    console.log('Admin unpublish article request', {
      articleId: id,
      adminId: authResult.adminId,
      timestamp: new Date().toISOString(),
    });

    // Check if article exists (sudah divalidasi di ownership check)
    const existingArticle = ownershipResult.article;

    console.log('Article status check:', {
      articleId: id,
      currentStatus: existingArticle.status,
      isPublished: existingArticle.status === 'published'
    });

    if (existingArticle.status !== 'published') {
      console.log('Unpublish failed - article not published:', {
        articleId: id,
        currentStatus: existingArticle.status
      });
      return NextResponse.json(
        { success: false, message: 'Article is not published' },
        { status: 400 }
      );
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        status: 'draft',
        publishedAt: null
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
    
    console.log('Admin Unpublish Article Response', responseTime, {
      articleId: article.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article unpublished successfully'
    });

  } catch (error) {
    console.error('Admin unpublish article error', {
      error: error.message,
      articleId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to unpublish article',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
