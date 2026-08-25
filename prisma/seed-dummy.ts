import { db } from '../src/lib/db';

async function main() {
  const farm = await db.farm.findFirst();
  if (!farm) return;

  // Create a flock
  const flock = await db.flock.create({
    data: {
      farmId: farm.id,
      batchName: 'Batch 1 - Alpha',
      initialCount: 5000,
      chickInDate: new Date(),
      isActive: true,
    }
  });

  // Create a daily record
  await db.dailyRecord.create({
    data: {
      flockId: flock.id,
      date: new Date(),
      mortality: 2,
      culling: 1,
      feedConsumedKg: 150.5,
      waterConsumedL: 300.2,
      temperature: 28.5,
      notes: 'Kondisi DOC baik.'
    }
  });

  console.log('Dummy livestock data added to farm: ' + farm.name);
}

main().catch(console.error).finally(() => db.$disconnect());
