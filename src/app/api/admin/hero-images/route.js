import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../lib/auth';
import { logger } from '../../../../lib/logger';

const prisma = new PrismaClient();

/**
 * GET /api/admin/hero-images
 * Get all hero images
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const perPage = parseInt(searchParams.get('per_page')) || 10;
    const skip = (page - 1) * perPage;

    // Use raw SQL query as fallback
    const heroImages = await prisma.$queryRaw`
      SELECT h.*, a.username, a.name 
      FROM hero_images h 
      LEFT JOIN admins a ON h.admin_id = a.id 
      ORDER BY h.order ASC 
      LIMIT ${perPage} OFFSET ${skip}
    `;

    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM hero_images
    `;
    const total = Number(totalResult[0].count);

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Hero images retrieved successfully',
        code: 200
      },
      data: {
        heroImages,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage)
        }
      }
    });

  } catch (error) {
    logger.error('Hero images API error', {
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

/**
 * POST /api/admin/hero-images
 * Create new hero image
 */
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Token required',
          code: 401
        }
      }, { status: 401 });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Invalid token',
          code: 401
        }
      }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, imagePath, url, height, order } = body;

    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Image URL is required',
          code: 400
        }
      }, { status: 400 });
    }

    // Use raw SQL query to create hero image
    const result = await prisma.$queryRaw`
      INSERT INTO hero_images (image_url, image_path, url, height, \`order\`, isActive, created_at, updated_at, admin_id)
      VALUES (${imageUrl}, ${imagePath || null}, ${url || null}, ${height || 400}, ${order || 0}, 1, NOW(), NOW(), ${decoded.id})
    `;

    // Get the created hero image
    const createdHeroImage = await prisma.$queryRaw`
      SELECT h.*, a.username, a.name 
      FROM hero_images h 
      LEFT JOIN admins a ON h.admin_id = a.id 
      WHERE h.admin_id = ${decoded.id}
      ORDER BY h.id DESC 
      LIMIT 1
    `;

    logger.info('Hero image created', {
      heroImageId: createdHeroImage[0]?.id,
      adminId: decoded.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Hero image created successfully',
        code: 201
      },
      data: createdHeroImage[0]
    }, { status: 201 });

  } catch (error) {
    logger.error('Hero image creation error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to create hero image',
        code: 500
      }
    }, { status: 500 });
  }
}
