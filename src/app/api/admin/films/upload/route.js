import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'No file uploaded',
          code: 400
        }
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
          code: 400
        }
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'File size too large. Maximum size is 5MB.',
          code: 400
        }
      }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'films');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Save file
    const filePath = join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return file path relative to public directory
    const publicPath = `/uploads/films/${fileName}`;

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'File uploaded successfully',
        code: 200
      },
      data: {
        fileName,
        filePath: publicPath,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to upload file',
        code: 500
      }
    }, { status: 500 });
  }
}
