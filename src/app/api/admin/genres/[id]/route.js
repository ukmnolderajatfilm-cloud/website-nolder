import { NextResponse } from 'next/server'
import { FilmService } from '@/lib/services/filmService.js'
import { verifyToken } from '@/lib/auth.js'

// PUT - Update genre
export async function PUT(request, { params }) {
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

    const { id } = params
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

    const genre = await FilmService.updateGenre(id, judulGenre)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Genre updated successfully',
        code: 200
      },
      data: { genre }
    })

  } catch (error) {
    console.error('Update genre API error:', error)
    
    if (error.message === 'Genre not found') {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Genre not found',
          code: 404
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}

// DELETE - Delete genre
export async function DELETE(request, { params }) {
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

    const { id } = params
    const result = await FilmService.deleteGenre(id)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Genre deleted successfully',
        code: 200
      },
      data: result
    })

  } catch (error) {
    console.error('Delete genre API error:', error)
    
    if (error.message === 'Genre not found') {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Genre not found',
          code: 404
        }
      }, { status: 404 })
    }

    if (error.message.includes('being used by films')) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Cannot delete genre that is being used by films',
          code: 400
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}
