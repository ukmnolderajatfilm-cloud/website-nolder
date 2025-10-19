import { NextResponse } from 'next/server';

// Sample blog posts data - in production, this would come from a database
const sampleBlogPosts = [
  {
    id: 1,
    title: 'The Art of Cinematic Storytelling',
    slug: 'art-of-cinematic-storytelling',
    excerpt: 'Explore the fundamental techniques that make a film truly memorable and impactful. From character development to visual composition, learn how great directors craft compelling narratives.',
    content: `
      <p>In the world of cinema, storytelling is the foundation upon which all great films are built. It's not just about having a good plot or interesting characters—it's about creating an emotional connection with your audience that lasts long after the credits roll.</p>
      
      <h2>Understanding the Fundamentals</h2>
      <p>The art of cinematic storytelling lies in the ability to weave together multiple elements: narrative structure, character development, visual composition, and emotional resonance. Each of these components must work in harmony to create a compelling and memorable experience.</p>
      
      <blockquote>"The art of storytelling lies not in the words we use, but in the emotions we evoke and the connections we forge with our audience."</blockquote>
      
      <h3>Character Development</h3>
      <p>Great characters are the heart of any story. They must be relatable, flawed, and capable of growth. Audiences connect with characters who face real challenges and make difficult choices that reveal their true nature.</p>
      
      <h3>Visual Composition</h3>
      <p>Every frame in a film is an opportunity to advance the story. The way you compose your shots, use lighting, and arrange elements within the frame can convey emotions and information without a single word being spoken.</p>
      
      <h2>Key Takeaways</h2>
      <ul>
        <li>Focus on character development and emotional resonance</li>
        <li>Use visual composition to enhance narrative impact</li>
        <li>Create compelling dialogue that feels natural</li>
        <li>Pay attention to pacing and rhythm</li>
        <li>Remember that every element should serve the story</li>
      </ul>
      
      <p>Mastering the art of cinematic storytelling takes time, practice, and a deep understanding of both the technical and emotional aspects of filmmaking. But with dedication and passion, anyone can learn to create stories that resonate with audiences around the world.</p>
    `,
    featuredImage: '/uploads/1758954623342-jqnx11xrb3o.png',
    author: 'Nol Derajat Film',
    category: 'Film Making',
    readTime: '5 min read',
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Behind the Scenes: Our Latest Production',
    slug: 'behind-the-scenes-latest-production',
    excerpt: 'Take a look at the creative process behind our most recent film project. Discover the challenges, triumphs, and lessons learned during production.',
    content: `
      <p>Every film production is a journey filled with unexpected challenges, creative breakthroughs, and moments of pure magic. Our latest project was no exception, and we're excited to share some insights from behind the scenes.</p>
      
      <h2>The Pre-Production Phase</h2>
      <p>Months of planning went into this project before we even picked up a camera. From script development to location scouting, every detail was carefully considered to ensure we could bring our vision to life.</p>
      
      <h3>Location Challenges</h3>
      <p>One of our biggest challenges was finding the perfect location that matched our creative vision while staying within budget. After weeks of scouting, we discovered a hidden gem that became the heart of our story.</p>
      
      <h2>Production Insights</h2>
      <p>The actual filming process brought its own set of challenges and triumphs. Working with a talented cast and crew, we navigated weather issues, equipment malfunctions, and the constant pressure of staying on schedule.</p>
      
      <blockquote>"The best moments in filmmaking often come from the unexpected challenges that force you to think creatively."</blockquote>
      
      <h3>Team Collaboration</h3>
      <p>One of the most rewarding aspects of this production was seeing how our team came together to solve problems and create something truly special. Each member brought their unique skills and perspective to the project.</p>
      
      <h2>Lessons Learned</h2>
      <ul>
        <li>Always have backup plans for critical scenes</li>
        <li>Communication is key to successful collaboration</li>
        <li>Sometimes the best ideas come from unexpected places</li>
        <li>Trust your instincts, but be open to feedback</li>
      </ul>
      
      <p>As we move into post-production, we're excited to see how all the pieces come together. The journey from concept to completion is always filled with surprises, and this project has been no exception.</p>
    `,
    featuredImage: '/uploads/1758954779106-aw1kghckqi.jpg',
    author: 'Nol Derajat Film',
    category: 'Behind the Scenes',
    readTime: '3 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: 'Film Festival Success Stories',
    slug: 'film-festival-success-stories',
    excerpt: 'Celebrating our achievements and recognition in various film festivals. Learn about the journey from submission to acceptance and the impact on our creative community.',
    content: `
      <p>Film festivals are more than just competitions—they're celebrations of creativity, storytelling, and the power of cinema to connect people across cultures and experiences. We're honored to share our journey and the impact these festivals have had on our work.</p>
      
      <h2>The Submission Process</h2>
      <p>Submitting to film festivals is an art in itself. From choosing the right festivals for your work to preparing compelling submission materials, every step requires careful consideration and attention to detail.</p>
      
      <h3>Selecting the Right Festivals</h3>
      <p>Not all festivals are created equal, and finding the right fit for your film is crucial. We research each festival's history, audience, and focus areas to ensure our submissions align with their mission and values.</p>
      
      <h2>Celebrating Our Achievements</h2>
      <p>Over the past year, we've been fortunate to receive recognition at several prestigious festivals. These achievements represent not just personal success, but validation of our creative vision and hard work.</p>
      
      <blockquote>"Every festival acceptance is a reminder that our stories matter and have the power to resonate with audiences around the world."</blockquote>
      
      <h3>Impact on Our Community</h3>
      <p>These festival successes have had a ripple effect throughout our creative community. They've inspired other filmmakers, opened doors for collaboration, and helped establish Nol Derajat Film as a serious creative force.</p>
      
      <h2>Looking Forward</h2>
      <ul>
        <li>Continue submitting to prestigious international festivals</li>
        <li>Support emerging filmmakers in our community</li>
        <li>Use our platform to amplify diverse voices</li>
        <li>Share our knowledge and experience with others</li>
      </ul>
      
      <p>The journey doesn't end with festival acceptance—it's just the beginning of a new chapter in our creative evolution. We're excited to continue pushing boundaries and telling stories that matter.</p>
    `,
    featuredImage: '/uploads/1758955486705-ywjuzdh6g7.jpg',
    author: 'Nol Derajat Film',
    category: 'Achievements',
    readTime: '4 min read',
    status: 'published',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Find the post by slug
    const post = sampleBlogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return NextResponse.json({
        success: false,
        data: null,
        meta: {
          status: 'error',
          message: 'Post not found'
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        post: post
      },
      meta: {
        status: 'success',
        message: 'Blog post fetched successfully'
      }
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({
      success: false,
      data: null,
      meta: {
        status: 'error',
        message: 'Failed to fetch blog post'
      }
    }, { status: 500 });
  }
}
