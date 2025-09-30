const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function setupDivisions() {
  try {
    console.log('🚀 Setting up divisions...');
    
    // Run Prisma migration
    console.log('📦 Running Prisma migration...');
    execSync('npx prisma migrate dev --name add-divisions-table', { stdio: 'inherit' });
    
    // Run divisions seeder
    console.log('🌱 Seeding divisions...');
    execSync('node scripts/seed-divisions.js', { stdio: 'inherit' });
    
    console.log('✅ Divisions setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up divisions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDivisions();


