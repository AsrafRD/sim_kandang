import { Prisma } from '@prisma/client';

// Tipe bentukan Prisma dengan relasi yang sering dipakai (Include)
export type FlockWithRecords = Prisma.FlockGetPayload<{
  include: { dailyRecords: true };
}>;

export type FarmWithMembers = Prisma.FarmGetPayload<{
  include: { members: { include: { user: true } } };
}>;

export type InventoryWithLogs = Prisma.InventoryGetPayload<{
  include: { logs: true };
}>;

export type TenantMemberWithUser = Prisma.TenantMemberGetPayload<{
  include: { user: true };
}>;

export type TenantMemberWithFarm = Prisma.TenantMemberGetPayload<{
  include: { farm: true };
}>;
