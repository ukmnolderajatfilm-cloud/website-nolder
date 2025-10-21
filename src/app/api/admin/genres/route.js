import { NextResponse } from 'next/server'
import { FilmService } from '@/lib/services/filmService.js'
import { verifyToken } from '@/lib/auth.js'

// GET - Get all genres
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

    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Invalid token',
          code: 401
        }
      }, { status: 401 })
    }

    const genres = await FilmService.getAllGenres()

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Genres retrieved successfully',
        code: 200
      },
      data: { genres }
    })

  } catch (error) {
    console.error('Genres API error:', error)
    return NextResponse.json({
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}

// POST - Create new genre
export async function POST(request) {
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

    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Invalid token',
          code: 401
        }
      }, { status: 401 })
    }

    const body = await request.json()
    const { judulGenre } = body

    if (!judulGenre || judulGenre.trim().length === 0) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Genre name is required',
          code: 400
        }
      }, { status: 400 })
    }

    const genre = await FilmService.createGenre(judulGenre)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Genre created successfully',
        code: 201
      },
      data: { genre }
    })

  } catch (error) {
    console.error('Create genre API error:', error)
    return NextResponse.json({
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}
