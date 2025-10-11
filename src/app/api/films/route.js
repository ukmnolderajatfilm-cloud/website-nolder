import { NextResponse } from 'next/server';
import { FilmService } from '../../../lib/services/filmService';

/**
 * GET /api/films
 * Public endpoint to get films for display on website
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const per_page = parseInt(searchParams.get('per_page')) || 12;
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const status = searchParams.get('status') || 'now_showing'; // Default to now_showing for public
    const sort_by = searchParams.get('sort_by') || 'releaseDate';
    const sort_order = searchParams.get('sort_order') || 'desc';

    // Build filters
    const filters = {
      page,
      per_page,
      search,
      genre,
      status,
      sort_by,
      sort_order,
      include_deleted: false // Don't show deleted films to public
    };

    const result = await FilmService.getAll(filters);

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Films retrieved successfully',
        code: 200
      },
      data: result
    });

  } catch (error) {
    console.error('Error in GET /api/films:', error);
    
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to retrieve films',
        code: 500
      }
    }, { status: 500 });
  }
}
