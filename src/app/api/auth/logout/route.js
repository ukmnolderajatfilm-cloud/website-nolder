import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('Logout API called');
    
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

    console.log('✅ Logout API completed successfully');
    return response
  } catch (error) {
    console.error('❌ Logout error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
