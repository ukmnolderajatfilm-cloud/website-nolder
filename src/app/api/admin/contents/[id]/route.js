import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { verifyToken } from '../../../../../lib/auth'

// PUT - Update content
export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    verifyToken(token)
    const data = await request.json()
    const { id } = params

    const content = await prisma.content.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null
      }
    })

    return NextResponse.json({ 
      success: true,
      content 
    })

  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// DELETE - Delete content
export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    verifyToken(token)
    const { id } = params

    await prisma.content.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Content deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
