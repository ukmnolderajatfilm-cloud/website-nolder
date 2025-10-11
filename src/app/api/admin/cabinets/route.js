import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

// GET - Fetch all cabinets
export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Authentication required. Please login first.' 
      }, { status: 401 })
    }

    try {
      verifyToken(token)
    } catch (authError) {
      console.error('Token verification failed:', authError)
      return NextResponse.json({ 
        success: false,
        error: 'Invalid or expired token. Please login again.' 
      }, { status: 401 })
    }

    const cabinets = await prisma.cabinet.findMany({
      include: {
        members: {
          include: {
            division: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true,
      cabinets 
    })

  } catch (error) {
    console.error('Error fetching cabinets:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// POST - Create new cabinet
export async function POST(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const data = await request.json()

    const cabinet = await prisma.cabinet.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        adminId: decoded.id
      },
      include: {
        members: true
      }
    })

    return NextResponse.json({ 
      success: true,
      cabinet 
    })

  } catch (error) {
    console.error('Error creating cabinet:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

