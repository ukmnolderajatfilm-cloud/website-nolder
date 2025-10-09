import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// GET - Fetch active cabinet for public view (no auth required)
export async function GET(request) {
  try {
    // Find the active cabinet
    const activeCabinet = await prisma.cabinet.findFirst({
      where: {
        status: 'active'
      },
      include: {
        members: {
          include: {
            division: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!activeCabinet) {
      return NextResponse.json({ 
        success: true,
        cabinet: null,
        message: 'No active cabinet found'
      })
    }

    return NextResponse.json({ 
      success: true,
      cabinet: activeCabinet
    })

  } catch (error) {
    console.error('Error fetching active cabinet:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}

