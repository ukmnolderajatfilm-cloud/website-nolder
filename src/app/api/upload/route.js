import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '../../../lib/logger'

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const data = await request.formData()
    const file = data.get('file')

    logger.info('File upload attempt started', { 
      ip: request.ip,
      userAgent: request.headers.get('user-agent')
    });

    if (!file) {
      logger.warn('File upload failed - no file provided', {
        ip: request.ip,
        userAgent: request.headers.get('user-agent')
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'No file uploaded' 
      }, { status: 400 })
    }

    // Log file details
    logger.info('File upload details', {
      originalName: file.name,
      size: file.size,
      type: file.type,
      ip: request.ip
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      logger.warn('File upload failed - invalid file type', {
        fileName: file.name,
        fileType: file.type,
        allowedTypes,
        ip: request.ip
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      logger.warn('File upload failed - file too large', {
        fileName: file.name,
        fileSize: file.size,
        maxSize,
        ip: request.ip
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // For Railway: Use temporary directory (files will be lost on restart)
    // TODO: Implement proper file storage (Railway Volumes or external storage)
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      logger.info('Created uploads directory', { path: uploadsDir });
    }
    
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${filename}`

    const responseTime = Date.now() - startTime;
    console.log('File upload successful', {
      filename: filename,
      originalName: file.name,
      size: file.size,
      fileType: file.type
    });

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      filename: filename
    })

  } catch (error) {
    logger.error('File upload error', {
      error: error.message,
      stack: error.stack,
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed' 
    }, { status: 500 })
  }
}


