import { NextResponse } from 'next/server';
import { FilmService } from '../../../lib/services/filmService';
import { logger, performance } from '../../../lib/logger';

/**
 * GET /api/films
 * Public endpoint to get films for display on website
 */
export async function GET(request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const per_page = parseInt(searchParams.get('per_page')) || 12;
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const status = searchParams.get('status') || 'now_showing'; // Default to now_showing for public
    const statusFilter = status === 'all' ? '' : status; // If status is 'all', don't filter by status
    const sort_by = searchParams.get('sort_by') || 'releaseYear';
    const sort_order = searchParams.get('sort_order') || 'desc';

    // Log API request
    logger.info('Films API request', {
      page,
      per_page,
      search,
      genre,
      status: statusFilter,
      sort_by,
      sort_order,
      ip: request.ip,
      userAgent: request.headers.get('user-agent')
    });

    // Build filters
    const filters = {
      page,
      perPage: per_page,
      search,
      genre,
      status: statusFilter,
      sortBy: sort_by,
      sortOrder: sort_order,
      includeDeleted: false // Don't show deleted films to public
    };

    const result = await FilmService.getAllFilms(filters);

    const responseTime = Date.now() - startTime;
    performance('Films API Response', responseTime, {
      totalFilms: result?.total || 0,
      page,
      per_page,
      search,
      genre,
      status: statusFilter
    });

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Films retrieved successfully',
        code: 200
      },
      data: result
    });

  } catch (error) {
    logger.error('Films API error', {
      error: error.message,
      stack: error.stack,
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to retrieve films',
        code: 500
      }
    }, { status: 500 });
  }
}
