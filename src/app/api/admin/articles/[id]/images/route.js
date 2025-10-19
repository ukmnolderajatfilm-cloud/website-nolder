import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateAdminAuth, validateArticleOwnership } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/admin/articles/[id]/images
 * Get all images for an article
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Validate admin auth
    const authResult = await validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    // Validate article ownership
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: ownershipResult.error },
        { status: 403 }
      );
    }

    const images = await prisma.articleImage.findMany({
      where: { articleId: parseInt(id) },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: { images }
    });

  } catch (error) {
    console.error('Error fetching article images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/articles/[id]/images
 * Add new image to article
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { imageUrl, imagePath, altText, caption, order = 0 } = body;
    
    // Validate admin auth
    const authResult = await validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    // Validate article ownership
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: ownershipResult.error },
        { status: 403 }
      );
    }

    const image = await prisma.articleImage.create({
      data: {
        imageUrl,
        imagePath,
        altText,
        caption,
        order: parseInt(order),
        articleId: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      data: { image }
    });

  } catch (error) {
    console.error('Error adding article image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]/images/[imageId]
 * Delete image from article
 */
export async function DELETE(request, { params }) {
  try {
    const { id, imageId } = await params;
    
    // Validate admin auth
    const authResult = await validateAdminAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    // Validate article ownership
    const ownershipResult = await validateArticleOwnership(id, authResult.adminId);
    if (!ownershipResult.isValid) {
      return NextResponse.json(
        { success: false, message: ownershipResult.error },
        { status: 403 }
      );
    }

    await prisma.articleImage.delete({
      where: { 
        id: parseInt(imageId),
        articleId: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
