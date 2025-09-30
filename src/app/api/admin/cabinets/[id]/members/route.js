import { NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/db'
import { verifyToken } from '../../../../../../lib/auth'

// GET - Fetch all members of a cabinet
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

    const { id } = await params

    const members = await prisma.cabinetMember.findMany({
      where: { cabinetId: parseInt(id) },
      include: {
        division: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true,
      members 
    })

  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

// POST - Add new member to cabinet
export async function POST(request, { params }) {
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
    const { id } = await params

    // Validate required fields
    if (!data.name || !data.position || !data.divisionId) {
      console.log('Missing required fields:', { 
        name: data.name, 
        position: data.position, 
        divisionId: data.divisionId 
      });
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: name, position, and divisionId are required' 
      }, { status: 400 })
    }

    const member = await prisma.cabinetMember.create({
      data: {
        name: data.name,
        position: data.position,
        description: data.description,
        image: data.image,
        divisionId: data.divisionId,
        cabinetId: parseInt(id)
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
    console.error('Error creating member:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

