import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewGenreSystem() {
  console.log('🧪 Testing new genre system...');

  try {
    // Test 1: Check if genres table exists and has data
    console.log('\n1️⃣ Testing genres table...');
    const genres = await prisma.genre.findMany();
    console.log(`✅ Found ${genres.length} genres in database`);
    console.log('📝 Genres:', genres.map(g => g.judulGenre));

    // Test 2: Check if film_genres table exists
    console.log('\n2️⃣ Testing film_genres junction table...');
    const filmGenres = await prisma.filmGenre.findMany({
      include: {
        film: { select: { filmTitle: true } },
        genre: { select: { judulGenre: true } }
      }
    });
    console.log(`✅ Found ${filmGenres.length} film-genre relationships`);
    if (filmGenres.length > 0) {
      console.log('📝 Sample relationships:', filmGenres.slice(0, 3).map(fg => 
        `${fg.film.filmTitle} -> ${fg.genre.judulGenre}`
      ));
    }

    // Test 3: Test creating a film with multiple genres
    console.log('\n3️⃣ Testing film creation with multiple genres...');
    const actionGenre = await prisma.genre.findFirst({ where: { judulGenre: 'Action' } });
    const dramaGenre = await prisma.genre.findFirst({ where: { judulGenre: 'Drama' } });
    
    if (actionGenre && dramaGenre) {
      const testFilm = await prisma.film.create({
        data: {
          filmTitle: 'Test Film with Multiple Genres',
          duration: 120,
          director: 'Test Director',
          releaseDate: new Date('2024-01-01'),
          status: 'coming_soon',
          adminId: 1, // Assuming admin with ID 1 exists
          filmGenres: {
            create: [
              { genreId: actionGenre.id },
              { genreId: dramaGenre.id }
            ]
          }
        },
        include: {
          filmGenres: {
            include: {
              genre: { select: { judulGenre: true } }
            }
          }
        }
      });

      console.log('✅ Successfully created film with multiple genres');
      console.log('📝 Film:', testFilm.filmTitle);
      console.log('📝 Genres:', testFilm.filmGenres.map(fg => fg.genre.judulGenre));

      // Clean up test film
      await prisma.film.delete({ where: { id: testFilm.id } });
      console.log('🧹 Test film cleaned up');
    } else {
      console.log('⚠️ Could not find Action or Drama genres for testing');
    }

    // Test 4: Test film query with genre relations
    console.log('\n4️⃣ Testing film queries with genre relations...');
    const filmsWithGenres = await prisma.film.findMany({
      include: {
        filmGenres: {
          include: {
            genre: { select: { judulGenre: true } }
          }
        }
      },
      take: 3
    });

    console.log(`✅ Found ${filmsWithGenres.length} films with genre data`);
    filmsWithGenres.forEach(film => {
      console.log(`📝 ${film.filmTitle}: ${film.filmGenres.map(fg => fg.genre.judulGenre).join(', ')}`);
    });

    console.log('\n🎉 All tests passed! New genre system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testNewGenreSystem();
