import { NextResponse } from 'next/server';

// Sample blog categories data
const blogCategories = [
  {
    id: 1,
    name: 'Film Making',
    slug: 'film-making',
    description: 'Techniques and insights about film production',
    postCount: 2
  },
  {
    id: 2,
    name: 'Behind the Scenes',
    slug: 'behind-the-scenes',
    description: 'Exclusive looks at our production process',
    postCount: 1
  },
  {
    id: 3,
    name: 'Achievements',
    slug: 'achievements',
    description: 'Our awards and recognition stories',
    postCount: 1
  },
  {
    id: 4,
    name: 'Technical',
    slug: 'technical',
    description: 'Technical aspects of filmmaking',
    postCount: 1
  },
  {
    id: 5,
    name: 'Production',
    slug: 'production',
    description: 'Production insights and tips',
    postCount: 1
  },
  {
    id: 6,
    name: 'Industry',
    slug: 'industry',
    description: 'Film industry trends and analysis',
    postCount: 1
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        categories: blogCategories
      },
      meta: {
        status: 'success',
        message: 'Blog categories fetched successfully'
      }
    });

  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({
      success: false,
      data: null,
      meta: {
        status: 'error',
        message: 'Failed to fetch blog categories'
      }
    }, { status: 500 });
  }
}
