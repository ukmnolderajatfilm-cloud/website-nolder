const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up Blog Management System...\n');

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');

  // Step 2: Run database migration
  console.log('🗄️  Running database migration...');
  try {
    execSync('npx prisma migrate dev --name add_blog_tables', { stdio: 'inherit' });
    console.log('✅ Database migration completed successfully\n');
  } catch (migrationError) {
    console.log('⚠️  Migration failed, but continuing with seeding...\n');
  }

  // Step 3: Seed blog data
  console.log('🌱 Seeding blog data...');
  execSync('node scripts/seed-blog-data.js', { stdio: 'inherit' });
  console.log('✅ Blog data seeded successfully\n');

  console.log('🎉 Blog Management System setup completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Visit the admin panel: http://localhost:3000/admin');
  console.log('3. Create your first article: http://localhost:3000/admin/blog/create');
  console.log('4. View the blog: http://localhost:3000/blog');
  console.log('\n✨ Happy blogging!');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
