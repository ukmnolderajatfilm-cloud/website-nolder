import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { verifyToken } from '../../../../../lib/auth'

// GET - Fetch single division
export async function GET(request, { params }) {
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

    const division = await prisma.division.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!division) {
      return NextResponse.json({ 
        success: false,
        error: 'Division not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      division 
    })

  } catch (error) {
    console.error('Error fetching division:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// PUT - Update division
export async function PUT(request, { params }) {
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

    const division = await prisma.division.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive
      }
    })

    return NextResponse.json({ 
      success: true,
      division 
    })

  } catch (error) {
    console.error('Error updating division:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// DELETE - Delete division
export async function DELETE(request, { params }) {
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

    // Check if division has members
    const membersCount = await prisma.cabinetMember.count({
      where: { divisionId: parseInt(params.id) }
    })

    if (membersCount > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Cannot delete division with existing members' 
      }, { status: 400 })
    }

    await prisma.division.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ 
      success: true 
    })

  } catch (error) {
    console.error('Error deleting division:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

