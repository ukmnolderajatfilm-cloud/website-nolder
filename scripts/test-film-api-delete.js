const fetch = require('node-fetch');

// Test film delete through API
async function testFilmAPIDelete() {
  try {
    console.log('🧪 Testing film delete through API...')
    
    // First, get all films to see what's available
    console.log('📋 Getting all films...')
    const filmsResponse = await fetch('http://localhost:3000/api/admin/films', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'admin-token=your-admin-token-here' // You'll need to replace this with actual token
      }
    });
    
    if (!filmsResponse.ok) {
      console.log('❌ Failed to get films. Make sure the server is running and you have a valid admin token.')
      console.log('Status:', filmsResponse.status)
      return
    }
    
    const filmsData = await filmsResponse.json()
    console.log(`📊 Found ${filmsData.data.films.length} active films`)
    
    if (filmsData.data.films.length === 0) {
      console.log('ℹ️  No active films to test delete with')
      return
    }
    
    // Test delete on first film
    const testFilm = filmsData.data.films[0]
    console.log(`🎬 Testing delete on film: ${testFilm.filmTitle} (ID: ${testFilm.id})`)
    
    const deleteResponse = await fetch(`http://localhost:3000/api/admin/films/${testFilm.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'admin-token=your-admin-token-here' // You'll need to replace this with actual token
      }
    });
    
    const deleteData = await deleteResponse.json()
    console.log('🗑️  Delete response:', deleteData)
    
    if (deleteData.meta.status === 'success') {
      console.log('✅ Film deleted successfully!')
      
      // Verify it's gone from the list
      console.log('🔍 Verifying film is no longer in active list...')
      const verifyResponse = await fetch('http://localhost:3000/api/admin/films', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'admin-token=your-admin-token-here'
        }
      });
      
      const verifyData = await verifyResponse.json()
      const remainingFilms = verifyData.data.films.filter(f => f.id === testFilm.id)
      
      if (remainingFilms.length === 0) {
        console.log('✅ Confirmed: Film is no longer in active films list')
      } else {
        console.log('❌ Problem: Film still appears in active films list')
      }
      
    } else {
      console.log('❌ Delete failed:', deleteData.meta.message)
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

// Instructions for running the test
console.log('📝 Instructions:')
console.log('1. Make sure your Next.js server is running (npm run dev)')
console.log('2. Login to admin panel and get your admin-token from browser cookies')
console.log('3. Replace "your-admin-token-here" in this script with your actual token')
console.log('4. Run: node scripts/test-film-api-delete.js')
console.log('')

testFilmAPIDelete()
