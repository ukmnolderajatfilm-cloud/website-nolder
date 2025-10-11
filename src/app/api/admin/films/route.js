import { NextResponse } from 'next/server'
import { FilmService } from '../../../../lib/services/filmService'
import { verifyToken } from '../../../../lib/auth'

// GET - Fetch all films with pagination, search, and filters
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const perPage = parseInt(searchParams.get('per_page')) || 15
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const status = searchParams.get('status') || ''
    const ratingMin = searchParams.get('rating_min') || ''
    const ratingMax = searchParams.get('rating_max') || ''
    const year = searchParams.get('year') || ''
    const sortBy = searchParams.get('sort_by') || 'createdAt'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const includeDeleted = searchParams.get('include_deleted') === 'true'

    const options = {
      page,
      perPage,
      search,
      genre,
      status,
      ratingMin,
      ratingMax,
      year,
      sortBy,
      sortOrder,
      includeDeleted
    }

    const result = await FilmService.getAllFilms(options)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Films retrieved successfully',
        code: 200
      },
      data: result
    })

  } catch (error) {
    console.error('Error fetching films:', error)
    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}

// POST - Create new film
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

    const data = await request.json()
    const film = await FilmService.createFilm(data, decoded.id)

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film created successfully',
        code: 201
      },
      data: { film }
    })

  } catch (error) {
    console.error('Error creating film:', error)
    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 400
      }
    }, { status: 400 })
  }
}

// PUT - Bulk operations (status update, delete)
export async function PUT(request) {
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

    const { action, filmIds, status } = await request.json()

    if (!action || !filmIds || !Array.isArray(filmIds) || filmIds.length === 0) {
      return NextResponse.json({ 
        meta: {
          status: 'error',
          message: 'Invalid request data',
          code: 400
        }
      }, { status: 400 })
    }

    let result
    let message

    switch (action) {
      case 'bulk_status_update':
        if (!status) {
          return NextResponse.json({ 
            meta: {
              status: 'error',
              message: 'Status is required for bulk status update',
              code: 400
            }
          }, { status: 400 })
        }
        result = await FilmService.bulkUpdateStatus(filmIds, status, decoded.id)
        message = `Updated ${result.updatedCount} films status to ${status}`
        break

      case 'bulk_delete':
        result = await FilmService.bulkDelete(filmIds, decoded.id)
        message = `Deleted ${result.deletedCount} films`
        break

      default:
        return NextResponse.json({ 
          meta: {
            status: 'error',
            message: 'Invalid action',
            code: 400
          }
        }, { status: 400 })
    }

    return NextResponse.json({
      meta: {
        status: 'success',
        message,
        code: 200
      },
      data: result
    })

  } catch (error) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json({ 
      meta: {
        status: 'error',
        message: error.message || 'Server error',
        code: 500
      }
    }, { status: 500 })
  }
}
