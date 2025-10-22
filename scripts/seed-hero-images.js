import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedHeroImages() {
  console.log('🌱 Seeding hero images...');

  try {
    // Get admin ID
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      console.error('❌ No admin found. Please run setup-db.js first.');
      return;
    }

    // Sample hero images
    const heroImages = [
      {
        imageUrl: 'https://picsum.photos/id/1015/600/900?grayscale',
        imagePath: 'https://picsum.photos/id/1015/600/900?grayscale',
        url: '#',
        height: 400,
        order: 1,
        adminId: admin.id
      },
      {
        imageUrl: 'https://picsum.photos/id/1011/600/750?grayscale',
        imagePath: 'https://picsum.photos/id/1011/600/750?grayscale',
        url: '#',
        height: 250,
        order: 2,
        adminId: admin.id
      },
      {
        imageUrl: 'https://picsum.photos/id/1020/600/800?grayscale',
        imagePath: 'https://picsum.photos/id/1020/600/800?grayscale',
        url: '#',
        height: 600,
        order: 3,
        adminId: admin.id
      },
      {
        imageUrl: 'https://picsum.photos/id/1025/600/700?grayscale',
        imagePath: 'https://picsum.photos/id/1025/600/700?grayscale',
        url: '#',
        height: 350,
        order: 4,
        adminId: admin.id
      },
      {
        imageUrl: 'https://picsum.photos/id/1031/600/850?grayscale',
        imagePath: 'https://picsum.photos/id/1031/600/850?grayscale',
        url: '#',
        height: 500,
        order: 5,
        adminId: admin.id
      }
    ];

    // Create hero images
    for (const heroImage of heroImages) {
      await prisma.heroImage.create({
        data: heroImage
      });
      console.log(`✅ Created hero image for slot ${heroImage.order}`);
    }

    console.log('🎉 All hero images seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding hero images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedHeroImages();
