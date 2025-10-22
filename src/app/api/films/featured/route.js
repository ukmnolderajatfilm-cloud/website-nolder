import { NextResponse } from 'next/server';
import { FilmService } from '../../../../lib/services/filmService';

/**
 * GET /api/films/featured
 * Public endpoint to get featured films (now_showing) for homepage
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = parseInt(searchParams.get('limit')) || 6;
    const status = searchParams.get('status') || 'now_showing';

    // Build filters for featured films
    const filters = {
      page: 1,
      per_page: limit,
      status: status,
      sort_by: 'releaseYear',
      sort_order: 'desc',
      include_deleted: false
    };

    const result = await FilmService.getAllFilms(filters);

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Featured films retrieved successfully',
        code: 200
      },
      data: result
    });

  } catch (error) {
    
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to retrieve featured films',
        code: 500
      }
    }, { status: 500 });
  }
}
