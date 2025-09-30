import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

// GET - Fetch all divisions
export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    try {
      verifyToken(token)
    } catch (error) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 })
    }

    const divisions = await prisma.division.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ 
      success: true,
      divisions 
    })

  } catch (error) {
    console.error('Error fetching divisions:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// POST - Create new division
export async function POST(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    try {
      verifyToken(token)
    } catch (error) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token' 
      }, { status: 401 })
    }

    const data = await request.json()

    const division = await prisma.division.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    })

    return NextResponse.json({ 
      success: true,
      division 
    })

  } catch (error) {
    console.error('Error creating division:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

