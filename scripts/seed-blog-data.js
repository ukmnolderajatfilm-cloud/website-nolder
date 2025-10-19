const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBlogData() {
  try {
    console.log('🌱 Starting blog data seeding...');

    // Create categories
    console.log('📂 Creating article categories...');
    
    const categories = [
      {
        categoryName: 'Film Making',
        slug: 'film-making',
        description: 'Articles about film production techniques, storytelling, and creative processes'
      },
      {
        categoryName: 'Behind the Scenes',
        slug: 'behind-the-scenes',
        description: 'Behind the scenes content, production stories, and making-of content'
      },
      {
        categoryName: 'Achievements',
        slug: 'achievements',
        description: 'Success stories, awards, and recognition in the film industry'
      },
      {
        categoryName: 'Technical',
        slug: 'technical',
        description: 'Technical articles, tutorials, and equipment reviews'
      },
      {
        categoryName: 'Production',
        slug: 'production',
        description: 'Production insights, workflows, and project management'
      },
      {
        categoryName: 'Industry',
        slug: 'industry',
        description: 'Industry news, trends, and market analysis'
      }
    ];

    for (const categoryData of categories) {
      await prisma.articleCategory.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData
      });
      console.log(`✅ Created/Updated category: ${categoryData.categoryName}`);
    }

    // Get the first admin (assuming admin with ID 1 exists)
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      console.log('❌ No admin found. Please create an admin first.');
      return;
    }

    // Create sample articles
    console.log('📝 Creating sample articles...');
    
    const articles = [
      {
        title: 'The Art of Cinematic Storytelling',
        slug: 'art-of-cinematic-storytelling',
        excerpt: 'Explore the fundamental techniques that make a film truly memorable and impactful. From character development to visual composition, learn how great directors craft compelling narratives.',
        content: `# The Art of Cinematic Storytelling

Cinematic storytelling is the foundation of great filmmaking. It's the art of using visual and narrative elements to create an emotional connection with your audience. In this comprehensive guide, we'll explore the key principles that make films truly memorable.

## Character Development

The heart of any great story lies in its characters. Well-developed characters drive the narrative forward and create emotional investment from the audience. Here are some key aspects to consider:

- **Character Arc**: Every protagonist should undergo a transformation throughout the story
- **Motivation**: Clear character motivations drive the plot and create conflict
- **Flaws and Strengths**: Complex characters with both positive and negative traits feel more human

## Visual Composition

The way you frame and compose your shots can tell a story without words. Consider these elements:

- **Rule of Thirds**: Place important elements along the lines or intersections
- **Leading Lines**: Use natural lines in your environment to guide the viewer's eye
- **Depth of Field**: Control what's in focus to direct attention

## Pacing and Rhythm

The rhythm of your film affects how the audience experiences the story:

- **Tension and Release**: Build tension, then provide moments of relief
- **Montage**: Use quick cuts to show the passage of time or build excitement
- **Long Takes**: Hold shots longer to create intimacy or tension

## Conclusion

Mastering cinematic storytelling takes practice and dedication. By focusing on character development, visual composition, and pacing, you can create films that resonate with audiences long after the credits roll.`,
        featuredImage: '/uploads/1758954623342-jqnx11xrb3o.png',
        status: 'published',
        publishedAt: new Date(),
        readTime: 5,
        categoryId: 1, // Film Making
        adminId: admin.id
      },
      {
        title: 'Behind the Scenes: Our Latest Production',
        slug: 'behind-the-scenes-latest-production',
        excerpt: 'Take a look at the creative process behind our most recent film project. Discover the challenges, triumphs, and lessons learned during production.',
        content: `# Behind the Scenes: Our Latest Production

Welcome to an exclusive look behind the scenes of our most ambitious project yet. This production pushed our creative boundaries and taught us valuable lessons about filmmaking.

## Pre-Production Challenges

The planning phase presented several unique challenges:

- **Location Scouting**: Finding the perfect locations that matched our vision
- **Casting**: Assembling the right team of actors and crew members
- **Budget Management**: Maximizing our resources for maximum impact

## Production Highlights

During the actual filming, we encountered both expected and unexpected moments:

- **Weather Challenges**: Adapting to changing weather conditions
- **Technical Difficulties**: Problem-solving on the fly
- **Creative Breakthroughs**: Moments of inspiration that elevated the project

## Post-Production Insights

The editing process revealed new possibilities:

- **Story Refinement**: How editing can reshape the narrative
- **Sound Design**: The importance of audio in creating atmosphere
- **Color Grading**: Using color to enhance mood and emotion

## Lessons Learned

This project taught us valuable lessons that will inform our future work:

1. **Flexibility is Key**: Be prepared to adapt when things don't go as planned
2. **Team Collaboration**: The importance of clear communication
3. **Attention to Detail**: Small details can make a big difference

## Conclusion

Every production is a learning experience. We're excited to apply these lessons to our next project and continue growing as filmmakers.`,
        featuredImage: '/uploads/1758954779106-aw1kghckqi.jpg',
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        readTime: 3,
        categoryId: 2, // Behind the Scenes
        adminId: admin.id
      },
      {
        title: 'Film Festival Success Stories',
        slug: 'film-festival-success-stories',
        excerpt: 'Celebrating our achievements and recognition in various film festivals. Learn about the journey from submission to acceptance and the impact on our creative community.',
        content: `# Film Festival Success Stories

We're thrilled to share our recent successes at various film festivals around the world. These achievements represent not just recognition for our work, but validation of our creative vision and dedication to storytelling.

## Festival Submissions

Our journey began with careful selection of festivals that aligned with our film's themes and target audience:

- **International Festivals**: Submitting to prestigious international competitions
- **Local Festivals**: Supporting our local film community
- **Specialized Festivals**: Targeting festivals focused on our genre

## Recognition and Awards

The recognition we've received has been both humbling and inspiring:

- **Best Short Film**: Recognition for narrative excellence
- **Audience Choice**: Validation from festival audiences
- **Technical Excellence**: Awards for cinematography and sound design

## Impact on Our Community

These successes have had a positive impact on our creative community:

- **Increased Visibility**: More opportunities for collaboration
- **Mentorship Opportunities**: Sharing knowledge with emerging filmmakers
- **Community Building**: Strengthening connections within the industry

## Lessons from the Festival Circuit

Participating in festivals taught us valuable lessons:

1. **Quality Over Quantity**: Focus on creating exceptional work
2. **Networking**: Building relationships within the industry
3. **Persistence**: The importance of continuing to submit and improve

## Future Goals

Looking ahead, we're excited about:

- **New Projects**: Applying lessons learned to future films
- **Mentorship**: Helping other filmmakers achieve their goals
- **Community Growth**: Continuing to build our creative network

## Conclusion

These festival successes are just the beginning. We're committed to continuing our journey of creative excellence and community building in the film industry.`,
        featuredImage: '/uploads/1758955486705-ywjuzdh6g7.jpg',
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        readTime: 4,
        categoryId: 3, // Achievements
        adminId: admin.id
      }
    ];

    for (const articleData of articles) {
      await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: articleData,
        create: articleData
      });
      console.log(`✅ Created/Updated article: ${articleData.title}`);
    }

    console.log('🎉 Blog data seeding completed successfully!');
    console.log(`📊 Created ${categories.length} categories and ${articles.length} articles`);

  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedBlogData()
  .then(() => {
    console.log('✅ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
