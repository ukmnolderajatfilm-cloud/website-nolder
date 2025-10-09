import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import https from 'https';

// Remove.bg API Key - Add this to your .env file
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || '';

/**
 * Remove background from image using Remove.bg API
 * Best Practice: Process on server-side, cache results
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageUrl = formData.get('imageUrl');
    
    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Image URL is required'
      }, { status: 400 });
    }

    // Check if API key is configured
    if (!REMOVE_BG_API_KEY) {
      console.warn('Remove.bg API key not configured, returning original image');
      return NextResponse.json({
        success: true,
        processedUrl: imageUrl,
        message: 'Background removal skipped - API key not configured'
      });
    }

    // Create processed images directory if it doesn't exist
    const processedDir = path.join(process.cwd(), 'public', 'uploads', 'processed');
    if (!existsSync(processedDir)) {
      await mkdir(processedDir, { recursive: true });
    }

    // Generate filename for processed image
    const originalFilename = path.basename(imageUrl);
    const processedFilename = `nobg-${originalFilename}`;
    const processedPath = path.join(processedDir, processedFilename);
    const processedUrl = `/uploads/processed/${processedFilename}`;

    // Check if already processed (cache check)
    if (existsSync(processedPath)) {
      console.log('Using cached processed image:', processedFilename);
      return NextResponse.json({
        success: true,
        processedUrl,
        cached: true
      });
    }

    console.log('Processing image with Remove.bg:', originalFilename);

    // Get full URL for the image
    const fullImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${request.nextUrl.origin}${imageUrl}`;

    // Call Remove.bg API
    const result = await removeBackground(fullImageUrl, REMOVE_BG_API_KEY);

    // Save processed image
    await writeFile(processedPath, result);

    console.log('Background removed successfully:', processedFilename);

    return NextResponse.json({
      success: true,
      processedUrl,
      cached: false
    });

  } catch (error) {
    console.error('Error removing background:', error);
    
    // Return original image URL on error (graceful degradation)
    const formData = await request.formData();
    const imageUrl = formData.get('imageUrl');
    
    return NextResponse.json({
      success: true,
      processedUrl: imageUrl,
      error: error.message,
      message: 'Background removal failed, using original image'
    });
  }
}

/**
 * Remove background using Remove.bg API
 * @param {string} imageUrl - URL of the image to process
 * @param {string} apiKey - Remove.bg API key
 * @returns {Promise<Buffer>} - Processed image buffer
 */
function removeBackground(imageUrl, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'api.remove.bg',
      path: '/v1.0/removebg',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        if (res.statusCode === 200) {
          resolve(buffer);
        } else {
          const error = JSON.parse(buffer.toString());
          reject(new Error(error.errors?.[0]?.title || 'Failed to remove background'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // Send request body
    req.write(JSON.stringify({
      image_url: imageUrl,
      size: 'auto',
      format: 'png'
    }));

    req.end();
  });
}
