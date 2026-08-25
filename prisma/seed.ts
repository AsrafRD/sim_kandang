import { db as prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');
  
  // 1. Create Superadmin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@kandang.com' },
    update: {},
    create: {
      email: 'admin@kandang.com',
      name: 'Super Admin',
      password: hashedPassword,
    },
  });
  console.log(`Created superadmin: ${superadmin.email}`);

  // 2. Create Farm
  const farm = await prisma.farm.create({
    data: {
      name: 'Farm Kemitraan Alpha',
      type: 'BROILER',
      address: 'Jl. Peternakan No. 1, Jawa Barat',
      latitude: -6.914744, // Bandung roughly
      longitude: 107.609810,
    }
  });
  console.log(`Created farm: ${farm.name}`);

  // 3. Link Superadmin to Farm
  await prisma.tenantMember.create({
    data: {
      userId: superadmin.id,
      farmId: farm.id,
      role: 'SUPERADMIN',
    }
  });
  
  // 4. Create Initial Inventory
  const pakan1 = await prisma.inventory.create({
    data: {
      farmId: farm.id,
      itemName: 'Pakan Starter BR-1',
      category: 'PAKAN',
      unit: 'KG',
      currentStock: 5000,
      minStock: 1000,
    }
  });
  
  await prisma.inventoryLog.create({
    data: {
      inventoryId: pakan1.id,
      type: 'IN_DO',
      amount: 5000,
      notes: 'Initial Seed from PT'
    }
  });

  const obat1 = await prisma.inventory.create({
    data: {
      farmId: farm.id,
      itemName: 'Vaksin ND Clone',
      category: 'VAKSIN',
      unit: 'BOTOL',
      currentStock: 50,
      minStock: 10,
    }
  });
  console.log('Created initial inventory');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });