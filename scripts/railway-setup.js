const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up Railway production database...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Run migrations
    console.log('📦 Running database migrations...')
    // Prisma will handle migrations automatically

    // Create admin user
    const hashedPassword = await bcrypt.hash('N0lderFilm2025', 12)
    
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

    console.log('✅ Admin user created:', admin.username)

    // Create divisions
    const divisions = [
      { name: 'Ketua Umum', code: 'ketua_umum' },
      { name: 'Wakil Ketua Umum', code: 'wakil_ketua_umum' },
      { name: 'ANF', code: 'anf' },
      { name: 'PSDI', code: 'psdi' },
      { name: 'PSDM', code: 'psdm' },
      { name: 'HUMI', code: 'humi' },
      { name: 'Produksi', code: 'produksi' },
      { name: 'DEA', code: 'dea' }
    ]

    for (const division of divisions) {
      await prisma.division.upsert({
        where: { code: division.code },
        update: {},
        create: division
      })
    }

    console.log('✅ Divisions created')

    // Create sample cabinet
    const sampleCabinet = await prisma.cabinet.upsert({
      where: { name: 'Kabinet Cineverso' },
      update: {},
      create: {
        name: 'Kabinet Cineverso',
        description: 'Kabinet yang bertanggung jawab untuk mengembangkan konten audio visual dan film di Nolder Rajat Film',
        status: 'active',
        adminId: admin.id
      }
    })

    console.log('✅ Sample cabinet created:', sampleCabinet.name)

    console.log('🎉 Railway production setup completed!')
    console.log('🔑 Admin credentials:')
    console.log('   Username: AdminN0lder')
    console.log('   Password: N0lderFilm2025')

  } catch (error) {
    console.error('❌ Setup error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
