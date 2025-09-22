import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyPassword, generateToken } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Cari admin di database
    const admin = await prisma.admin.findUnique({
      where: { 
        username: username,
        isActive: true 
      }
    })

    if (!admin) {
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 })
    }

    // Verifikasi password
    const isValid = await verifyPassword(password, admin.password)
    if (!isValid) {
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

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
