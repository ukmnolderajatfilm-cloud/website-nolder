import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearGenres() {
  console.log('🧹 Starting genre clearing...');

  try {
    // Delete all film genres first (due to foreign key constraints)
    const deletedFilmGenres = await prisma.filmGenre.deleteMany({});
    console.log(`🗑️ Deleted ${deletedFilmGenres.count} film genre relationships`);

    // Delete all genres
    const deletedGenres = await prisma.genre.deleteMany({});
    console.log(`🗑️ Deleted ${deletedGenres.count} genres`);

    console.log('✅ Successfully cleared all genres from database');
    console.log('📝 Table genres is now empty and ready for manual input');

  } catch (error) {
    console.error('❌ Error clearing genres:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearGenres();
