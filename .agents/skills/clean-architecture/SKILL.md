---
name: clean-architecture
description: Standar penulisan clean code, pemisahan layer logika, Zod validation, dan Server Actions di Next.js App Router
---

# Clean Architecture Skill

## Layering Pattern

1. **UI Layer (`src/app/` & `src/components/`):**
   - Server Components secara default untuk fetching data.
   - Client Components (`"use client"`) HANYA untuk interaktivitas (Form, Event Listener, State 3D).

2. **Validation Layer (`src/lib/validations/`):**
   - Setiap form wajib punya Zod Schema terpisah.
   - Ekspor tipe TypeScript dari schema: `type DailyRecordInput = z.infer<typeof dailyRecordSchema>`.

3. **Business & Domain Logic Layer (`src/lib/calc/` & `src/services/`):**
   - Murni fungsi TypeScript (Pure Functions). Tanpa dependency ke React/Next.js UI.
   - Contoh: Fungsi kalkulasi FCR, IP (Indeks Prestasi), dan Mortalitas.

4. **Data Access Layer (`src/actions/` atau `src/services/`):**
   - Gunakan Server Actions untuk mutasi data (`"use server"`).
   - Selalu kembalikan response berformat standar:
     `{ success: boolean; data?: T; error?: string }`
