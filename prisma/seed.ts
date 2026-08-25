import { PrismaClient, Role, FarmType } from './generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({} as any);

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing data (Opsional: menghapus data lama agar clean)
  await prisma.inventoryLog.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.dailyRecord.deleteMany();
  await prisma.flock.deleteMany();
  await prisma.tenantMember.deleteMany();
  await prisma.session.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.user.deleteMany();

  // 2. Password default untuk semua user dummy (password: "password123")
  const hashedPassword = await bcrypt.hash('Testdev123', 10);

  // 3. Buat User Dummy
  const superadminUser = await prisma.user.create({
    data: {
      name: 'Budi Superadmin',
      email: 'admin@kandang.com',
      password: hashedPassword,
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      name: 'Pak Hendra (Owner)',
      email: 'owner@kandang.com',
      password: hashedPassword,
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      name: 'Joko (Anak Kandang)',
      email: 'operator@kandang.com',
      password: hashedPassword,
    },
  });

  const supplierUser = await prisma.user.create({
    data: {
      name: 'PT Pakan Jaya (Supplier)',
      email: 'supplier@kandang.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Users created.');

  // 4. Buat Kandang Utama (Farm / Tenant)
  const farm = await prisma.farm.create({
    data: {
      name: 'Kandang Modern Alpha',
      type: FarmType.BROILER,
      address: 'Jl. Peternakan Sejahtera No. 12, Magelang',
    },
  });

  console.log('✅ Farm created:', farm.name);

  // 5. Daftarkan User ke TenantMember (Role Mapping)
  await prisma.tenantMember.createMany({
    data: [
      { userId: superadminUser.id, farmId: farm.id, role: Role.SUPERADMIN },
      { userId: ownerUser.id, farmId: farm.id, role: Role.OWNER },
      { userId: operatorUser.id, farmId: farm.id, role: Role.OPERATOR },
      { userId: supplierUser.id, farmId: farm.id, role: Role.SUPPLIER },
    ],
  });

  console.log('✅ Tenant Members & Roles assigned.');

  // 6. Buat Siklus Ternak (Flock Batch)
  const chickInDate = new Date();
  chickInDate.setDate(chickInDate.getDate() - 10); // Chick-in 10 hari yang lalu

  const flock = await prisma.flock.create({
    data: {
      farmId: farm.id,
      batchName: 'Batch Broiler Agst 2026',
      initialCount: 5000, // 5.000 ekor DOC
      chickInDate: chickInDate,
      isActive: true,
    },
  });

  console.log('✅ Active Flock created:', flock.batchName);

  // 7. Buat Daily Records Dummy (10 Hari Terakhir)
  for (let i = 0; i < 10; i++) {
    const recordDate = new Date(chickInDate);
    recordDate.setDate(recordDate.getDate() + i);

    await prisma.dailyRecord.create({
      data: {
        flockId: flock.id,
        date: recordDate,
        mortality: Math.floor(Math.random() * 5) + 1, // Kematian 1-5 ekor/hari
        culling: Math.floor(Math.random() * 2),
        feedConsumedKg: 150 + i * 20, // Pakan meningkat seiring umur ayam
        waterConsumedL: 300 + i * 35,
        temperature: 28.5 - i * 0.2, // Suhu kandang
        notes: i === 5 ? 'Vaksinasi ND via air minum' : undefined,
      },
    });
  }

  console.log('✅ 10 Days of Daily Records created.');

  // 8. Buat Stok Inventaris Pakan & Obat
  const feedInventory = await prisma.inventory.create({
    data: {
      farmId: farm.id,
      itemName: 'Pakan Starter BR-1',
      category: 'PAKAN',
      currentStock: 1200, // 1.200 kg
      unit: 'KG',
      minStock: 300,
    },
  });

  const medicineInventory = await prisma.inventory.create({
    data: {
      farmId: farm.id,
      itemName: 'Vitamin Vita-Stress',
      category: 'OBAT',
      currentStock: 15,
      unit: 'BOTOL',
      minStock: 5,
    },
  });

  // Log Transaksi Masuk Pakan
  await prisma.inventoryLog.create({
    data: {
      inventoryId: feedInventory.id,
      type: 'IN',
      amount: 1500,
      notes: 'Pengiriman awal dari PT Pakan Jaya',
    },
  });

  console.log('✅ Inventories & Stock Logs created.');
  console.log('🚀 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });