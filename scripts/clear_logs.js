const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.inventoryLog.deleteMany({});
  console.log('Cleared inventory logs');
}

main().catch(console.error).finally(() => prisma.$disconnect());
