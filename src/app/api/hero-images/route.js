import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

/**
 * GET /api/hero-images
 * Public endpoint to get active hero images for frontend
 */
export async function GET(request) {
  try {
    // Use raw SQL query as fallback
    const heroImages = await prisma.$queryRaw`
      SELECT id, image_url, image_path, url, height, \`order\`
      FROM hero_images 
      WHERE isActive = 1 
      ORDER BY \`order\` ASC
    `;

    // Transform data to match Masonry component format
    const masonryItems = heroImages.map(image => ({
      id: image.id.toString(),
      img: image.image_path || image.image_url,
      url: image.url || "#",
      height: image.height
    }));

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Hero images retrieved successfully',
        code: 200
      },
      data: masonryItems
    });

  } catch (error) {
    logger.error('Public hero images API error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to retrieve hero images',
        code: 500
      }
    }, { status: 500 });
  }
}
