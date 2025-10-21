import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western'
];

async function seedGenres() {
  console.log('🌱 Starting genre seeding...');

  try {
    // Check if genres already exist
    const existingGenres = await prisma.genre.count();
    if (existingGenres > 0) {
      console.log(`📊 Found ${existingGenres} existing genres. Skipping seeding.`);
      return;
    }

    // Create genres
    const createdGenres = await prisma.genre.createMany({
      data: genres.map(judulGenre => ({
        judulGenre: judulGenre
      })),
      skipDuplicates: true
    });

    console.log(`✅ Successfully created ${createdGenres.count} genres`);
    console.log('📝 Created genres:', genres);

  } catch (error) {
    console.error('❌ Error seeding genres:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedGenres();
