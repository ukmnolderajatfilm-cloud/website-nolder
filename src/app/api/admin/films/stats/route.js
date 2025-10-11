import { NextResponse } from 'next/server'
import { FilmService } from '../../../../../lib/services/filmService'
import { verifyToken } from '../../../../../lib/auth'

// GET - Get film statistics
export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Unauthorized',
          code: 401
        }
      }, { status: 401 })
    }

    try {
      verifyToken(token)
    } catch (error) {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Invalid token',
          code: 401
        }
      }, { status: 401 })
    }

    const stats = await FilmService.getFilmStats()

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film statistics retrieved successfully',
        code: 200
      },
      data: { stats }
    })

  } catch (error) {
    console.error('Error fetching film stats:', error)
    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}
