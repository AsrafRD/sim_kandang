import { db } from './src/lib/db';

async function seed() {
  const flock = await db.flock.findFirst({ where: { isActive: true } });
  if (!flock) { console.log('No active flock found'); return; }
  
  console.log('Seeding daily records for flock:', flock.id);
  
  const records = [];
  let date = new Date(flock.chickInDate);
  
  for(let i = 0; i < 7; i++) {
    records.push({
      flockId: flock.id,
      date: new Date(date),
      mortality: Math.floor(Math.random() * 5),
      culling: Math.floor(Math.random() * 2),
      feedConsumedKg: 100 + (i * 20) + Math.floor(Math.random() * 10),
      waterConsumedL: 200 + (i * 30),
      temperature: 28 + Math.random() * 2,
    });
    date.setDate(date.getDate() + 1);
  }
  
  await db.dailyRecord.createMany({ data: records });
  console.log('Created 7 daily records!');
}

seed().catch(console.error).finally(() => process.exit(0));
