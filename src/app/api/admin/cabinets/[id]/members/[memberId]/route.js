import { NextResponse } from 'next/server'
import { prisma } from '../../../../../../../lib/db'
import { verifyToken } from '../../../../../../../lib/auth'

// PUT - Update member
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
    const { id, memberId } = await params

    // Validate required fields
    if (!data.name || !data.position || !data.divisionId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: name, position, and divisionId are required' 
      }, { status: 400 })
    }

    const member = await prisma.cabinetMember.update({
      where: { 
        id: parseInt(memberId),
        cabinetId: parseInt(id)
      },
      data: {
        name: data.name,
        position: data.position,
        description: data.description || null,
        image: data.image || null,
        divisionId: typeof data.divisionId === 'number' ? data.divisionId : parseInt(data.divisionId)
      },
      include: {
        division: true
      }
    })

    return NextResponse.json({ 
      success: true,
      member 
    })

  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update member: ' + error.message 
    }, { status: 500 })
  }
}

// DELETE - Delete member
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

    const { id, memberId } = await params

    // Check if member exists before deleting
    const existingMember = await prisma.cabinetMember.findUnique({
      where: { 
        id: parseInt(memberId),
        cabinetId: parseInt(id)
      }
    })

    if (!existingMember) {
      return NextResponse.json({ 
        success: false,
        error: 'Member not found' 
      }, { status: 404 })
    }

    await prisma.cabinetMember.delete({
      where: { 
        id: parseInt(memberId),
        cabinetId: parseInt(id)
      }
    })

    return NextResponse.json({ 
      success: true 
    })

  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

