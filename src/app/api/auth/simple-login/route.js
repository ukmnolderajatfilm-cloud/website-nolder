import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyPassword, generateToken } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    
    console.log('Login attempt:', { username, password: '***' })

    // Cari admin di database (case insensitive)
    const allAdmins = await prisma.admin.findMany({
      where: { 
        isActive: true 
      }
    })
    
    const admin = allAdmins.find(a => a.username.toLowerCase() === username.toLowerCase())

    console.log('Admin found:', admin ? 'Yes' : 'No')

    if (!admin) {
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 })
    }

    // Verifikasi password
    const isValid = await verifyPassword(password, admin.password)
    console.log('Password valid:', isValid)

    if (!isValid) {
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 })
    }

    // Generate token
    const token = generateToken({ 
      id: admin.id, 
      username: admin.username, 
      role: admin.role 
    })

    console.log('Token generated:', token ? 'Yes' : 'No')

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    return NextResponse.json({ 
      success: true, 
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}
