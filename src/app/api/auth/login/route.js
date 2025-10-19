import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyPassword, generateToken } from '../../../../lib/auth'
import { logger } from '../../../lib/logger'

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const { username, password } = await request.json()
    
    logger.info('Login attempt started', { username, ip: request.ip });

    // Cari admin di database
    const admin = await prisma.admin.findUnique({
      where: { 
        username: username,
        isActive: true 
      }
    })

    if (!admin) {
      logger.auth('Login failed - user not found', username, false, { 
        username, 
        ip: request.ip,
        userAgent: request.headers.get('user-agent')
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 })
    }

    // Verifikasi password
    const isValid = await verifyPassword(password, admin.password)
    if (!isValid) {
      logger.auth('Login failed - invalid password', username, false, { 
        username, 
        ip: request.ip,
        userAgent: request.headers.get('user-agent')
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 })
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    // Generate token
    const token = generateToken({ 
      id: admin.id, 
      username: admin.username, 
      role: admin.role 
    })

    // Set cookie
    const response = NextResponse.json({ 
      success: true, 
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Log successful login
    const responseTime = Date.now() - startTime;
    logger.auth('Login successful', username, true, { 
      adminId: admin.id,
      role: admin.role,
      ip: request.ip,
      responseTime: `${responseTime}ms`
    });

    return response

  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack,
      username: request.body?.username || 'unknown',
      ip: request.ip,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
