const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testFilmDelete() {
  try {
    console.log('🔍 Checking films in database...')
    
    // Get all films (including deleted ones)
    const allFilms = await prisma.film.findMany({
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    })
    
    console.log(`📊 Total films in database: ${allFilms.length}`)
    
    // Separate active and deleted films
    const activeFilms = allFilms.filter(film => film.deletedAt === null)
    const deletedFilms = allFilms.filter(film => film.deletedAt !== null)
    
    console.log(`✅ Active films: ${activeFilms.length}`)
    console.log(`🗑️  Deleted films: ${deletedFilms.length}`)
    
    if (activeFilms.length > 0) {
      console.log('\n📋 Active films:')
      activeFilms.forEach(film => {
        console.log(`  - ID: ${film.id}, Title: "${film.filmTitle}", Status: ${film.status}`)
      })
    }
    
    if (deletedFilms.length > 0) {
      console.log('\n🗑️  Deleted films:')
      deletedFilms.forEach(film => {
        console.log(`  - ID: ${film.id}, Title: "${film.filmTitle}", Deleted: ${film.deletedAt}`)
      })
    }
    
    // Test soft delete on first active film
    if (activeFilms.length > 0) {
      const testFilm = activeFilms[0]
      console.log(`\n🧪 Testing soft delete on film ID: ${testFilm.id} - "${testFilm.filmTitle}"`)
      
      const updatedFilm = await prisma.film.update({
        where: { id: testFilm.id },
        data: { deletedAt: new Date() },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })
      
      console.log(`✅ Successfully soft deleted film: ${updatedFilm.filmTitle}`)
      console.log(`   Deleted at: ${updatedFilm.deletedAt}`)
      
      // Restore the film
      const restoredFilm = await prisma.film.update({
        where: { id: testFilm.id },
        data: { deletedAt: null },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })
      
      console.log(`🔄 Successfully restored film: ${restoredFilm.filmTitle}`)
    }
    
  } catch (error) {
    console.error('❌ Error testing film delete:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFilmDelete()
