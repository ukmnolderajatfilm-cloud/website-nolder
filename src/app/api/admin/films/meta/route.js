import { NextResponse } from 'next/server'
import { FilmService } from '../../../../../lib/services/filmService'
import { verifyToken } from '../../../../../lib/auth'

// GET - Get film metadata (genres, directors, etc.)
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

    const [genres, directors] = await Promise.all([
      FilmService.getUniqueGenres(),
      FilmService.getUniqueDirectors()
    ])

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film metadata retrieved successfully',
        code: 200
      },
      data: { 
        genres,
        directors,
        statuses: ['coming_soon', 'now_showing', 'archived']
      }
    })

  } catch (error) {
    console.error('Error fetching film metadata:', error)
    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}
