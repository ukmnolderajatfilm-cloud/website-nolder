import { NextResponse } from 'next/server';
import { FilmService } from '../../../../lib/services/filmService';

/**
 * GET /api/films/[id]
 * Public endpoint to get a single film by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Invalid film ID',
          code: 400
        }
      }, { status: 400 });
    }

    const film = await FilmService.getById(parseInt(id));

    if (!film) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Film not found',
          code: 404
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Film retrieved successfully',
        code: 200
      },
      data: { film }
    });

  } catch (error) {
    
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Failed to retrieve film',
        code: 500
      }
    }, { status: 500 });
  }
}
