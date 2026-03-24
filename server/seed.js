const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional, comment out to keep data)
  // await prisma.assetTransaction.deleteMany();
  // await prisma.equipmentType.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.base.deleteMany();

  // 1. Create Bases
  console.log('📍 Creating bases...');
  const base1 = await prisma.base.findFirst({ where: { name: 'Fort Liberty' } }) || 
    await prisma.base.create({
      data: { name: 'Fort Liberty', location: 'North Carolina' }
    });

  const base2 = await prisma.base.findFirst({ where: { name: 'Naval Base San Diego' } }) || 
    await prisma.base.create({
      data: { name: 'Naval Base San Diego', location: 'California' }
    });

  const base3 = await prisma.base.findFirst({ where: { name: 'Joint Base Pearl Harbor-Hickam' } }) || 
    await prisma.base.create({
      data: { name: 'Joint Base Pearl Harbor-Hickam', location: 'Hawaii' }
    });

  console.log('✅ Bases created:', [base1.name, base2.name, base3.name]);

  // 2. Create Equipment Types
  console.log('🛠️ Creating equipment types...');
  const equipment = [
    { name: 'M16 Rifle', category: 'Weapon', description: 'Assault Rifle' },
    { name: 'Humvee', category: 'Vehicle', description: 'Military Utility Vehicle' },
    { name: 'AH-64 Apache', category: 'Vehicle', description: 'Attack Helicopter' },
    { name: '5.56mm Ammunition', category: 'Ammunition', description: 'Standard Rifle Rounds' },
    { name: 'M240 Machine Gun', category: 'Weapon', description: 'General Purpose Machine Gun' },
    { name: 'T-90 Tank', category: 'Vehicle', description: 'Main Battle Tank' }
  ];

  for (const eq of equipment) {
    const exists = await prisma.equipmentType.findFirst({ where: { name: eq.name } });
    if (!exists) {
      await prisma.equipmentType.create({ data: eq });
    }
  }
  console.log('✅ Equipment types created:', equipment.length);

  // 3. Create Test Users
  console.log('👤 Creating test users...');

  // Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.findUnique({ where: { email: 'admin@military.mil' } }) || 
    await prisma.user.create({
      data: {
        name: 'Colonel James Mitchell',
        email: 'admin@military.mil',
        password: adminPassword,
        role: 'ADMIN',
        baseId: null
      }
    });

  // Commander User
  const commanderPassword = await bcrypt.hash('commander123', 10);
  const commander = await prisma.user.findUnique({ where: { email: 'commander@military.mil' } }) || 
    await prisma.user.create({
      data: {
        name: 'Major Sarah Chen',
        email: 'commander@military.mil',
        password: commanderPassword,
        role: 'COMMANDER',
        baseId: base1.id
      }
    });

  // Logistics User
  const logisticsPassword = await bcrypt.hash('logistics123', 10);
  const logistics = await prisma.user.findUnique({ where: { email: 'logistics@military.mil' } }) || 
    await prisma.user.create({
      data: {
        name: 'Captain Michael Rodriguez',
        email: 'logistics@military.mil',
        password: logisticsPassword,
        role: 'LOGISTICS',
        baseId: base1.id
      }
    });

  console.log('✅ Test users created');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('👑 ADMIN');
  console.log('   Email:    admin@military.mil');
  console.log('   Password: admin123');
  console.log('   Access:   Full system access, manage all bases');
  console.log('');
  console.log('🎖️  COMMANDER');
  console.log('   Email:    commander@military.mil');
  console.log('   Password: commander123');
  console.log('   Access:   Manage Fort Liberty only');
  console.log('');
  console.log('📦 LOGISTICS');
  console.log('   Email:    logistics@military.mil');
  console.log('   Password: logistics123');
  console.log('   Access:   View and perform transactions');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
