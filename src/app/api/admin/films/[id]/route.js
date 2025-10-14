import { NextResponse } from 'next/server'
import { FilmService } from '../../../../../lib/services/filmService'
import { verifyToken } from '../../../../../lib/auth'

// GET - Get single film details
export async function GET(request, { params }) {
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

    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get('include_deleted') === 'true'

    const film = await FilmService.getFilmById(id, includeDeleted)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film retrieved successfully',
        code: 200
      },
      data: { film }
    })

  } catch (error) {
    
    if (error.message === 'Film not found') {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Film not found',
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

// PUT - Update existing film
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
    const data = await request.json()

    // Check if this is a restore operation
    if (data.action === 'restore') {
      const film = await FilmService.restoreFilm(id, decoded.id)
      
      return NextResponse.json({
        meta: {
          status: 'success',
          message: 'Film restored successfully',
          code: 200
        },
        data: { film }
      })
    }

    const film = await FilmService.updateFilm(id, data, decoded.id)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film updated successfully',
        code: 200
      },
      data: { film }
    })

  } catch (error) {
    
    if (error.message === 'Film not found') {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Film not found',
          code: 404
        }
      }, { status: 404 })
    }

    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 400
      }
    }, { status: 400 })
  }
}

// DELETE - Soft delete film
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
    const film = await FilmService.deleteFilm(id, decoded.id)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film deleted successfully',
        code: 200
      },
      data: { film }
    })

  } catch (error) {
    
    if (error.message === 'Film not found') {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Film not found',
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
