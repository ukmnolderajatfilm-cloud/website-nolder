import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { verifyToken } from '../../../../../lib/auth'

// GET - Fetch single cabinet
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

    const cabinet = await prisma.cabinet.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        members: true
      }
    })

    if (!cabinet) {
      return NextResponse.json({ 
        success: false,
        error: 'Cabinet not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      cabinet 
    })

  } catch (error) {
    console.error('Error fetching cabinet:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// PUT - Update cabinet
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

    const cabinet = await prisma.cabinet.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name,
        description: data.description,
        status: data.status
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
    console.error('Error updating cabinet:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// DELETE - Delete cabinet
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

    // Delete cabinet (members will be cascade deleted)
    await prisma.cabinet.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ 
      success: true 
    })

  } catch (error) {
    console.error('Error deleting cabinet:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

