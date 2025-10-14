import { NextResponse } from 'next/server'

export async function POST() {
  try {
    
    const response = NextResponse.json({ 
      success: true,
      message: 'Logout berhasil' 
    })

    // Clear cookie dengan berbagai cara untuk memastikan
    response.cookies.set('admin-token', '', {
      httpOnly: false, // Biarkan client bisa akses
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Lebih permisif
      maxAge: 0,
      path: '/'
    })
    
    // Set cookie kosong juga
    response.cookies.set('admin-token', '', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
