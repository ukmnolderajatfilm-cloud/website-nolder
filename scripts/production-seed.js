const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function productionSeed() {
  try {
    console.log('🚀 Production seeding...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'AdminN0lder' }
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists, skipping admin creation');
    } else {
      // Create admin
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('N0lderFilm2025', 12);
      
      const admin = await prisma.admin.create({
        data: {
          username: 'AdminN0lder',
          password: hashedPassword,
          role: 'superadmin',
          name: 'Admin Nolder',
          email: 'admin@nolderajatfilm.com',
          isActive: true
        }
      });
      console.log('✅ Admin created:', admin.username);
    }
    
    // Check if divisions exist
    const existingDivisions = await prisma.division.findMany();
    
    if (existingDivisions.length === 0) {
      console.log('🌱 Seeding divisions...');
      const { execSync } = require('child_process');
      execSync('node scripts/seed-divisions.js', { stdio: 'inherit' });
      console.log('✅ Divisions seeded');
    } else {
      console.log('⚠️ Divisions already exist, skipping division seeding');
    }
    
    console.log('🎉 Production seed completed!');
    
  } catch (error) {
    console.error('❌ Error during production seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

productionSeed();
