---
name: prisma-multi-tenant
description: Aturan wajib isolasi data multi-tenant dan pemeriksaan otorisasi role berbasis Prisma
---

# Multi-Tenant Security Skill

## Mandatory Rules

1. **Guard Check First:**
   - Sebelum melakukan query Prisma apapun yang berdampak pada Kandang (`Flock`, `DailyRecord`, `Inventory`), WAJIB panggil helper otorisasi terlebih dahulu:
     ```typescript
     const member = await verifyTenantAccess(farmId, [
       Role.SUPERADMIN,
       Role.OPERATOR,
     ]);
     ```

2. **Explicit Farm ID Scope:**
   - Selalu sertakan `farmId` dalam klausul `where` Prisma untuk memastikan isolasi tenant:
     ```typescript
     await db.inventory.findMany({
       where: { farmId, category: "PAKAN" },
     });
     ```

3. **Role Restriction Matrix:**
   - `OPERATOR`: Hanya diizinkan `create` / `read` di `DailyRecord`.
   - `SUPPLIER`: Hanya `read` di `Inventory` & `create` di `DeliveryOrder`.
   - `OWNER` & `SUPERADMIN`: Full read/write sesuai hak akses.
