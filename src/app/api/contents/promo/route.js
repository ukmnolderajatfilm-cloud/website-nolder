import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// GET - Fetch published contents for promo display
export async function GET(request) {
  try {
    // Get current month and year
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Create start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)

    const contents = await prisma.content.findMany({
      where: {
        isPublished: true,
        banner: {
          not: null
        },
        publishedAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 5 // Limit to 5 most recent
    })

    return NextResponse.json({ 
      success: true,
      contents,
      monthInfo: {
        currentMonth: currentMonth + 1, // 1-based month
        currentYear,
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
