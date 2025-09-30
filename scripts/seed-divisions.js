const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const divisions = [
  { name: 'Ketua Umum', code: 'ketua_umum', description: 'Pimpinan tertinggi kabinet' },
  { name: 'Wakil Ketua Umum', code: 'wakil_ketua_umum', description: 'Wakil pimpinan tertinggi kabinet' },
  { name: 'ANF', code: 'anf', description: 'Administrative dan Finance' },
  { name: 'PSDI', code: 'psdi', description: 'Pengembangan Sumber Daya Internal' },
  { name: 'PSDM', code: 'psdm', description: 'Pengembangan Sumber Daya Manusia' },
  { name: 'HUMI', code: 'humi', description: 'Hubungan Masyarakat & Informasi' },
  { name: 'Produksi', code: 'produksi', description: 'Divisi Produksi' },
  { name: 'DEA', code: 'dea', description: 'Distribusi Exhibition Apresiasi' }
];

async function seedDivisions() {
  try {
    console.log('🌱 Seeding divisions...');
    
    // Check if divisions already exist
    const existingDivisions = await prisma.division.findMany();
    
    if (existingDivisions.length > 0) {
      console.log('⚠️ Divisions already exist, updating descriptions...');
      
      // Update existing divisions with correct descriptions
      for (const division of divisions) {
        const existing = existingDivisions.find(d => d.code === division.code);
        if (existing && existing.description !== division.description) {
          await prisma.division.update({
            where: { id: existing.id },
            data: { description: division.description }
          });
          console.log(`✅ Updated division: ${division.name}`);
        } else if (existing) {
          console.log(`⚠️ Division already up to date: ${division.name}`);
        } else {
          // Create new division if it doesn't exist
          await prisma.division.create({ data: division });
          console.log(`✅ Created division: ${division.name}`);
        }
      }
    } else {
      // Create divisions if none exist
      for (const division of divisions) {
        await prisma.division.create({ data: division });
        console.log(`✅ Created division: ${division.name}`);
      }
    }
    
    console.log('🎉 All divisions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding divisions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDivisions();
