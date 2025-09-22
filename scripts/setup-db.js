const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  // Hash password untuk admin default
  const hashedPassword = await bcrypt.hash('N0lderFilm2025', 12)

  // Buat admin default
  const admin = await prisma.admin.upsert({
    where: { username: 'AdminN0lder' },
    update: {},
    create: {
      username: 'AdminN0lder',
      password: hashedPassword,
      role: 'superadmin',
      name: 'Admin Nolder',
      email: 'admin@nolderajatfilm.com',
      isActive: true
    }
  })

  console.log('✅ Admin created:', admin)

  // Buat beberapa sample content
  const sampleContents = [
    {
      title: 'Tutorial Cinematography Dasar',
      description: 'Belajar dasar-dasar cinematography untuk pemula',
      platform: 'youtube',
      url: 'https://youtube.com/watch?v=example1',
      thumbnail: '/Images/sample-thumbnail-1.jpg',
      isPublished: true,
      publishedAt: new Date(),
      adminId: admin.id
    },
    {
      title: 'Behind the Scene: Film Terbaru',
      description: 'Lihat proses pembuatan film terbaru kami',
      platform: 'instagram',
      url: 'https://instagram.com/p/example1',
      thumbnail: '/Images/sample-thumbnail-2.jpg',
      isPublished: true,
      publishedAt: new Date(),
      adminId: admin.id
    },
    {
      title: 'Podcast: Dunia Perfilman Indonesia',
      description: 'Diskusi tentang industri perfilman Indonesia',
      platform: 'podcast',
      url: 'https://spotify.com/episode/example1',
      thumbnail: '/Images/sample-thumbnail-3.jpg',
      isPublished: true,
      publishedAt: new Date(),
      adminId: admin.id
    }
  ]

  for (const content of sampleContents) {
    await prisma.content.create({
      data: content
    })
  }

  console.log('✅ Sample contents created')

  // Buat beberapa sample projects
  const sampleProjects = [
    {
      title: 'Commercial Brand X',
      description: 'Video commercial untuk brand ternama',
      category: 'commercial',
      thumbnail: '/Images/sample-project-1.jpg',
      videoUrl: 'https://youtube.com/watch?v=project1',
      isPublished: true,
      publishedAt: new Date(),
      adminId: admin.id
    },
    {
      title: 'Documentary: Life in Jakarta',
      description: 'Dokumenter tentang kehidupan di Jakarta',
      category: 'documentary',
      thumbnail: '/Images/sample-project-2.jpg',
      videoUrl: 'https://youtube.com/watch?v=project2',
      isPublished: true,
      publishedAt: new Date(),
      adminId: admin.id
    }
  ]

  for (const project of sampleProjects) {
    await prisma.project.create({
      data: project
    })
  }

  console.log('✅ Sample projects created')

  console.log('🎉 Database setup completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error setting up database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
