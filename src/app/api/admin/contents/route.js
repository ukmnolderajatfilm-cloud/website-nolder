import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

// GET - Fetch all contents
export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    verifyToken(token)

    const contents = await prisma.content.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true,
      contents 
    })

  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// POST - Create new content
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

    const content = await prisma.content.create({
      data: {
        ...data,
        adminId: decoded.id,
        publishedAt: data.isPublished ? new Date() : null
      }
    })

    return NextResponse.json({ 
      success: true,
      content 
    })

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
