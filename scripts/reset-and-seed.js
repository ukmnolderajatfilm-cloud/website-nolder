const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🔄 Resetting and seeding database...');
    
    // Kill any running Node processes to avoid EPERM errors
    try {
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
      console.log('✅ Killed existing Node processes');
    } catch (error) {
      console.log('⚠️ No Node processes to kill');
    }
    
    // Wait a bit for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset database
    console.log('🗑️ Resetting database...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    console.log('✅ Database reset completed');
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    // Seed divisions
    console.log('🌱 Seeding divisions...');
    execSync('node scripts/seed-divisions.js', { stdio: 'inherit' });
    console.log('✅ Divisions seeded');
    
    // Setup database with admin and sample data
    console.log('👤 Setting up admin and sample data...');
    execSync('node scripts/setup-db.js', { stdio: 'inherit' });
    console.log('✅ Admin and sample data created');
    
    console.log('🎉 Database reset and seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during reset and seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();


