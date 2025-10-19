const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupBlogDatabase() {
  try {
    console.log('🔧 Setting up blog database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Create sample categories
    console.log('📝 Creating sample categories...');
    const categories = await Promise.all([
      prisma.articleCategory.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          categoryName: 'Technology',
          slug: 'technology',
          description: 'Articles about technology and innovation',
          isActive: true
        }
      }),
      prisma.articleCategory.upsert({
        where: { slug: 'cinema' },
        update: {},
        create: {
          categoryName: 'Cinema',
          slug: 'cinema',
          description: 'Film reviews and cinema discussions',
          isActive: true
        }
      }),
      prisma.articleCategory.upsert({
        where: { slug: 'lifestyle' },
        update: {},
        create: {
          categoryName: 'Lifestyle',
          slug: 'lifestyle',
          description: 'Lifestyle and culture articles',
          isActive: true
        }
      })
    ]);
    
    console.log('✅ Categories created:', categories.length);
    
    // Create sample articles
    console.log('📝 Creating sample articles...');
    const articles = await Promise.all([
      prisma.article.upsert({
        where: { slug: 'introduction-to-cinema' },
        update: {},
        create: {
          title: 'Introduction to Modern Cinema',
          slug: 'introduction-to-cinema',
          excerpt: 'Exploring the evolution of cinema and its impact on storytelling',
          content: 'Cinema has evolved tremendously over the past century...',
          status: 'published',
          categoryId: categories[1].id,
          adminId: 1,
          readTime: 5,
          publishedAt: new Date()
        }
      }),
      prisma.article.upsert({
        where: { slug: 'web-development-trends' },
        update: {},
        create: {
          title: 'Web Development Trends 2024',
          slug: 'web-development-trends',
          excerpt: 'Latest trends and technologies in web development',
          content: 'The web development landscape is constantly changing...',
          status: 'published',
          categoryId: categories[0].id,
          adminId: 1,
          readTime: 8,
          publishedAt: new Date()
        }
      }),
      prisma.article.upsert({
        where: { slug: 'draft-article' },
        update: {},
        create: {
          title: 'Draft Article - Coming Soon',
          slug: 'draft-article',
          excerpt: 'This is a draft article',
          content: 'This article is still being written...',
          status: 'draft',
          categoryId: categories[2].id,
          adminId: 1,
          readTime: 2
        }
      })
    ]);
    
    console.log('✅ Articles created:', articles.length);
    
    // Test queries
    console.log('🧪 Testing queries...');
    const allArticles = await prisma.article.findMany({
      include: {
        category: true,
        admin: true
      }
    });
    
    const publishedArticles = await prisma.article.findMany({
      where: { status: 'published' },
      include: { category: true }
    });
    
    console.log('✅ Total articles:', allArticles.length);
    console.log('✅ Published articles:', publishedArticles.length);
    
    console.log('🎉 Blog database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up blog database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupBlogDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupBlogDatabase };
