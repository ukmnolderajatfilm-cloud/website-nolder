const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testNoRating() {
  try {
    console.log('🧪 Testing that rating column has been removed...')
    
    // Try to get films and check if rating field exists
    const films = await prisma.film.findMany({
      take: 1
    })
    
    if (films.length > 0) {
      const film = films[0]
      console.log('📋 Sample film data:')
      console.log('  - ID:', film.id)
      console.log('  - Title:', film.filmTitle)
      console.log('  - Genre:', film.filmGenre)
      console.log('  - Duration:', film.duration)
      console.log('  - Director:', film.director)
      console.log('  - Status:', film.status)
      console.log('  - Created:', film.createdAt)
      
      // Check if rating field exists (it should not)
      if ('rating' in film) {
        console.log('❌ ERROR: Rating field still exists in database!')
        console.log('  Rating value:', film.rating)
      } else {
        console.log('✅ SUCCESS: Rating field has been removed from database')
      }
    } else {
      console.log('ℹ️  No films found in database')
    }
    
    // Test creating a new film without rating
    console.log('\n🧪 Testing film creation without rating...')
    
    try {
      const newFilm = await prisma.film.create({
        data: {
          filmTitle: 'Test Film Without Rating',
          filmGenre: 'Action',
          duration: 120,
          director: 'Test Director',
          releaseYear: '2024',
          status: 'coming_soon',
          description: 'Test film without rating field',
          adminId: 1 // Assuming admin with ID 1 exists
        }
      })
      
      console.log('✅ SUCCESS: Film created without rating field')
      console.log('  New film ID:', newFilm.id)
      console.log('  New film title:', newFilm.filmTitle)
      
      // Clean up test film
      await prisma.film.delete({
        where: { id: newFilm.id }
      })
      console.log('🧹 Test film cleaned up')
      
    } catch (error) {
      if (error.message.includes('rating')) {
        console.log('❌ ERROR: Rating field is still required in database schema')
        console.log('  Error:', error.message)
      } else {
        console.log('⚠️  WARNING: Film creation failed, but not due to rating field')
        console.log('  Error:', error.message)
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testNoRating()
