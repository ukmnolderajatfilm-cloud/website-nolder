import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../../lib/auth';
import { logger } from '../../../../../lib/logger';

const prisma = new PrismaClient();

/**
 * PUT /api/admin/hero-images/[id]
 * Update hero image
 */
export async function PUT(request, { params }) {
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

    const { id } = params;
    const body = await request.json();
    const { imageUrl, imagePath, url, height, order, isActive } = body;

    // Check if hero image exists
    const existingHeroImage = await prisma.$queryRaw`
      SELECT * FROM hero_images WHERE id = ${parseInt(id)}
    `;

    if (!existingHeroImage || existingHeroImage.length === 0) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Hero image not found',
          code: 404
        }
      }, { status: 404 });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    if (imagePath !== undefined) {
      updateFields.push('image_path = ?');
      updateValues.push(imagePath);
    }
    if (url !== undefined) {
      updateFields.push('url = ?');
      updateValues.push(url);
    }
    if (height !== undefined) {
      updateFields.push('height = ?');
      updateValues.push(height);
    }
    if (order !== undefined) {
      updateFields.push('`order` = ?');
      updateValues.push(order);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'No fields to update',
          code: 400
        }
      }, { status: 400 });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(parseInt(id));

    // Execute update
    await prisma.$executeRaw`
      UPDATE hero_images 
      SET ${updateFields.join(', ')}
      WHERE id = ${parseInt(id)}
    `;

    // Get updated hero image
    const updatedHeroImage = await prisma.$queryRaw`
      SELECT h.*, a.username, a.name 
      FROM hero_images h 
      LEFT JOIN admins a ON h.admin_id = a.id 
      WHERE h.id = ${parseInt(id)}
    `;

    logger.info('Hero image updated', {
      heroImageId: parseInt(id),
      adminId: decoded.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Hero image updated successfully',
        code: 200
      },
      data: updatedHeroImage[0]
    });

  } catch (error) {
    logger.error('Hero image update error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to update hero image',
        code: 500
      }
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/hero-images/[id]
 * Delete hero image
 */
export async function DELETE(request, { params }) {
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

    const { id } = params;

    // Check if hero image exists
    const existingHeroImage = await prisma.$queryRaw`
      SELECT * FROM hero_images WHERE id = ${parseInt(id)}
    `;

    if (!existingHeroImage || existingHeroImage.length === 0) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Hero image not found',
          code: 404
        }
      }, { status: 404 });
    }

    // Delete hero image
    await prisma.$executeRaw`
      DELETE FROM hero_images WHERE id = ${parseInt(id)}
    `;

    logger.info('Hero image deleted', {
      heroImageId: parseInt(id),
      adminId: decoded.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Hero image deleted successfully',
        code: 200
      }
    });

  } catch (error) {
    logger.error('Hero image deletion error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to delete hero image',
        code: 500
      }
    }, { status: 500 });
  }
}
