<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md - Cetak Biru Pengembangan SIM Management Kandang Ternak Ayam (Multi-Tenant PWA)

## Active Agent Skills

Agent wajib membaca dan mematuhi skill eksternal di dalam `.agents/skills/`:

- `ui-design-system`: Untuk aturan styling Tailwind, komponen Shadcn, dan warna.
- `clean-architecture`: Untuk pemisahan Server Actions, Zod Validations, dan domain logic.
- `prisma-multi-tenant`: Untuk validasi keamanan data multi-kandang.
- `pwa-offline-first`: Untuk optimasi form harian anak kandang.

## 1. Misi Utama & Konsep Produk

Kamu adalah AI Agent Senior Full-Stack Engineer & Product Designer. Tugasmu adalah mengimplementasikan **Sistem Informasi Manajemen Kandang Ternak Ayam (Broiler & Layer)** berbasis Web (Multi-Tenant PWA) bernama **"Agricultural Intelligence Dashboard"**.

Aplikasi ini **BUKAN** sekadar _SaaS dashboard template_ standar. Visual direction produk ini mengusung filosofi:

> **"Organic 3D Agriculture × Editorial Information Design × Modern Data Visualization"**

---

## 2. Tech Stack Mandatori

- **Framework:** Next.js 14+ (App Router, React Server Components, Server Actions)
- **Language:** TypeScript (Strict Type Checking)
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Styling & UI:** Tailwind CSS + `shadcn/ui` + Lucide Icons
- **Form & Validation:** `react-hook-form` + `zod`
- **Auth:** Local Session Authentication via HTTP-Only Safe Cookie (`jose` + `bcryptjs`)
- **PWA:** `@ducanh2912/next-pwa` (Support Offline-First untuk input harian di area kandang)
- **3D Engine:** Three.js / `@react-three/fiber` / `@react-three/drei` atau CSS Isometrik / Canvas SVG Interaktif yang ultra-ringan.

---

## 3. Comprehensive Visual & UI/UX Design System Guidelines

### A. Alur & Persona Visual Utama

- **Homepage (`/`)**: _3D Immersive + Natural Organic_ (Light & Warm) -> _"Welcome to the farm."_
- **Management System (`/farm/[id]`)**: _Modern Data Dashboard + Semi-3D_ (Clean & Productive) -> _"Manage the farm."_
- **Data Analytics (`/farm/[id]/analytics`)**: _Dark Analytical Style_ (High-Contrast Data Storytelling) -> _"Understand the farm."_

### B. "DNA" Desain & Larangan Ketat (Anti-AI UI)

1. **DNA Desain:** Kombinasi _Poster 4P Green_ (hirarki kuat, tipografi tegas), _Dashboard 3D_ (depth & data visualization), dan _Safari UI_ (soft card, bentuk organik tanpa terkesan terlalu puffy/anak-anak).
2. **Fungsi 3D:** **DILARANG** menggunakan 3D hanya sebagai dekorasi atau tempelan berputar tanpa fungsi. 3D harus menjadi _centerpiece_ yang memuat data terintegrasi.
3. **Keseimbangan Visual:**
   - **Landing Page (`/`)**: 70% Visual / 30% Informasi.
   - **Dashboard (`/farm/[id]`)**: 30% Visual / 70% Informasi (Jangan bebani user yang sedang bekerja).
4. **Hindari AI UI Pattern:**
   - ❌ DILARANG: Gradient purple-blue, Glassmorphism berlebihan, semua sudut `rounded-2xl`, semua card diberi shadow tebal, semua section serba center, icon lucu random, dan angka glowing berlebihan.
   - ✅ GUNAKAN: _Asymmetry + Typography Contrast + Whitespace + Organic Shape + Restrained 3D_.

### C. Color Palette & Token Rules

Rasio warna UI: **60% Cream/Surface, 25% Dark Green, 10% Muted Green, 5% Accent Yellow/Red**.

- **Background (Light / Homepage / Dashboard Overview):** `#F5F2E8` / `#F4F1E7` (Light + Warm + Organic, BUKAN putih polos SaaS).
- **Background (Dark Analytics Page Only):** `#17221C` (Dark Forest untuk kontras data visualisasi yang dingin dan presisi).
- **Primary:** `#58763A` (Leaf Green).
- **Deep Dark:** `#233629` / `#263D28` (Pine Green untuk teks utama dan elemen terkuat).
- **Accent:** `#D7A84A` / `#D8A84E` (Harvest Gold untuk status/highlight penting).
- **Earth:** `#8C6A45` (Clay Brown).
- **Surface:** `#FFFFFF` (Card data & Form).
- **Muted:** `#7C8176` (Sub-label & caption).
- **Status Alerts:** Success `#6E9B55`, Warning `#D59A3A`, Danger `#C65A4A`.

### D. System Hirarki Depth ("Semi-3D")

Jangan buat semua card menjadi 3D. Terapkan 4 tingkatan hirarki:

1. **Level 0 (Flat):** Teks, Tabel Data, Label, Navigasi.
2. **Level 1 (Soft Depth):** Standard Cards, Form Inputs (`box-shadow: 0 8px 24px rgba(38, 61, 40, 0.08)`).
3. **Level 2 (Elevated):** Highlight KPI Card, Card terpilih, Popover/Toast.
4. **Level 3 (Interactive 3D):** 3D Barn Map, Model Ternak, Lingkungan Kandang Interaktif.

### E. Organic Geometry Guidelines

Gunakan variasi bentuk sesuai konteks data:

- **Soft/Organic Cards:** Gunakan sudut melengkung asimetris untuk card umum.
- **Hard Edge / Technical:** Gunakan border-radius tajam (`rounded-none` / `rounded-sm`) untuk **Tabel Data**, **Grafik Teknis**, dan **Informasi Angka Spesifik**.

### F. Tipografi Berkarakter & Kontras Visual

- Gunakan **Display Serif/Sans Bold** untuk Heading utama (contoh: `386` [Baris 1] `ANIMALS` [Baris 2] dalam huruf kapital tegas).
- Gunakan **Clean Sans-Serif** yang netral untuk label UI operasional dan form harian.

### G. Signature Feature: "3D Barn Map" & Interaktivitas

- Halaman `/farm/[id]/barns` wajib menampilkan petakan 3D/Isometrik lokasi kandang.
- **Interaksi Hover:** Hover pada kandang akan menaikkan posisi objek (`scale(1.02)`, `translateY(-8px)`), meningkatkan shadow, dan menampilkan tooltip info cepat: _Jumlah Ternak, Kematian, Suhu (°C), dan Sisa Pakan (%)_.
- Sensor IoT/Kondisi Kritis memiliki efek _pulse animation_ halus (`●`).

### H. Navigasi Sidebar Berorientasi Agrikultur

Struktur Sidebar tidak boleh bergaya SaaS generik:

- **FARM:** Overview, Barns (3D Map), Livestock.
- **OPERATIONS:** Feeding (Pakan), Health & Vaccines, Daily Entry.
- **INSIGHTS:** Analytics (Dark Mode), Financial Reports.

---

## 5. Multi-Tenancy, RBAC & Autentikasi SecurityAuthentication

Gunakan Local Session Cookie (HttpOnly, SameSite=Lax, Secure) via jose + bcryptjs.TIDAK PERLU refresh token client-side manual karena Next.js menangani via Server Actions / Middleware.Role-Based Access Control (RBAC):SUPERADMIN: Pembuat Kandang; Full Access (Kelola User, Siklus, Keuangan, Supplier).OWNER: Pemilik Modal; Access Dashboard Analitik, FCR, IP, Stok (Read-Only Management).SUPPLIER: Access khusus stok pakan/obat (Read-Only) + Upload DO/Invoice.OPERATOR: Akses Form Input Harian (Touch-Friendly Mobile UX untuk Kematian, Pakan, Suhu, Telur).Data Isolation Constraints:Semua mutasi (Server Actions) dan query data Prisma WAJIB memverifikasi keanggotaan userId di TenantMember pada farmId terkait sebelum eksekusi.

## 6. Formula Bisnis & Indikator Kinerja (KPI Engine)

Seluruh logika kalkulasi bisnis diletakkan pada @/lib/calc/:FCR (Feed Conversion Ratio):$$\text{FCR} = \frac{\text{Total Pakan Dikonsumsi (kg)}}{\text{Total Bobot Panen (kg)}}$$Mortalitas (%):$$\text{Mortalitas (\%)} = \left( \frac{\text{Total Ayam Mati + Afkir}}{\text{Populasi DOC Awal}} \right) \times 100$$IP (Indeks Prestasi - Broiler):$$\text{IP} = \frac{(100 - \text{Mortalitas}) \times \text{Rata-rata Bobot (kg)}}{\text{FCR} \times \text{Umur Panen (hari)}} \times 100$$

````

## 4. Struktur Komponen & Arsitektur Kode

Wajib memisahkan komponen 3D dan komponen Manajemen secara tegas untuk mencegah _spaghetti code_:

```text
src/
├── app/
│   ├── (auth)/             # Login & Register (Local Auth)
│   ├── (marketing)/        # Homepage Landing (3D Immersive, Cream #F5F2E8)
│   └── farm/[farmId]/      # Multi-Tenant Protected Routes
│       ├── overview/       # Modern Dashboard (Semi-3D)
│       ├── daily-input/    # Mobile-First Operator Input Form (PWA)
│       ├── barns/          # 3D Barn Map & Interactive Environment
│       ├── inventory/      # Stock Pakan & Obat + Alert System
│       ├── analytics/      # Dark Mode Analytical Dashboard (#17221C)
│       └── reports/        # Clean Editorial Reports
├── components/
│   ├── 3d/                 # BarnScene, Cow/ChickenModel, FarmEnvironment, BarnMarker
│   ├── layout/             # Sidebar (Agri-Style), Topbar, TenantSwitcher
│   ├── ui/                 # GlassCard, SoftCard, MetricCard, OrganicGeometry
│   ├── charts/             # Dark Analytics Charts (HealthChart, FeedChart, GrowthChart)
│   ├── livestock/          # AnimalCard, AnimalStatus, AnimalTimeline
│   └── barn/               # BarnCard, BarnMap, BarnTemperature
├── lib/
│   ├── validations/        # Zod Schemas (DailyRecord, Auth, Inventory)
│   └── calc/               # Formula FCR, IP (Indeks Prestasi), HDP
````

## 7. Roadmap Eksekusi Bertahap (Agent Directives)

Step 1: Setup Local Auth (Register, Login, Session Cookie) & Route Guard (middleware.ts).

Step 2: Dashboard Multi-Tenant Shell (Sidebar Agrikultur, Tenant Switcher, Warm Theme #F5F2E8).

Step 3: Modul Quick Daily Input (Form Mobile-Friendly PWA + Service Worker setup).

Step 4: Modul Interactive 3D Barn Map & Hover Indicators (/barns).

Step 5: Modul Dark Mode Analytics (/analytics) + Notification Alert System (Mortalitas tinggi / Stok Pakan habis).
