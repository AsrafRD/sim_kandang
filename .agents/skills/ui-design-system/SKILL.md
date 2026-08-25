---
name: ui-design-system
description: Pedoman mutlak UI/UX dan Design System untuk Agricultural Intelligence Dashboard (Organic 3D Agriculture × Editorial Information Design × Modern Data Visualization).
---

# UI/UX & Design System Skill Directive

## Arah Visual & Flow

- **Homepage:** 3D immersive + natural
- **Management system:** modern data dashboard + semi-3D
- **Data visualization:** dark/green analytical style

**Alur Visual:**
🌱 Nature / Farm → 🐄 3D livestock → 📊 Professional management → 🔬 Data & analytics

---

## 1. DNA Desain

- **Referensi yang Diambil:**
  - 🟢 **Poster 4P:** Green, hierarchy kuat, typography besar (Jangan diambil berlebihan: Layout terlalu poster).
  - 🌲 **Dashboard 3D:** 3D data visualization, dark mode, depth (Jangan diambil berlebihan: Terlalu banyak grafik dekoratif).
  - 🦒 **Safari UI:** Soft card, illustration, organic shape, navigation (Jangan diambil berlebihan: Semua elemen dibuat rounded/puffy).
- **Hasil Akhir:** **"Agricultural Intelligence Dashboard"** (Bukan sekadar "Sistem Informasi Management Kandang", tapi terasa seperti platform digital untuk mengelola peternakan modern).

---

## 2. Fungsi 3D (Non-Dekoratif)

- ❌ **DILARANG:** Dashboard biasa → ditambahkan model sapi 3D → selesai.
- ✅ **MANDATORI:** 3D harus punya fungsi informasi.
- Model 3D kandang/sapi menjadi centerpiece, kemudian data mengelilinginya. 3D bukan tempelan.

```text
┌───────────────────────────────────────────────────────┐
│ LOGO              Dashboard  Kandang  Ternak  Report │
│                                                       │
│       SMART LIVESTOCK MANAGEMENT                     │
│       Kelola kandang dengan data yang lebih cerdas.  │
│                                                       │
│                         🐄                            │
│                    ┌───────────┐                      │
│                  🐄│   KANDANG │🐄                   │
│                    └───────────┘                      │
│                                                       │
│       24 Kandang      386 Ternak       97% Sehat     │
└───────────────────────────────────────────────────────┘
```

3.  Style HomepageLight + warm + organic (BUKAN dark dashboard).Palette Homepage:Background: #F4F1E7 atau #F6F3EAPrimary: #58763ADeep green: #263D28Accent: #D8A84EEarth: #8C6A45Surface: #FFFFFFPrinsip Warna: Cream + green + earth + sedikit yellow (Agriculture + premium technology, bukan SaaS dashboard template).4. Hero Homepage StructureHero dibuat kontras dan ekstrem.Visual Scene: 1 environment + 2–3 focal objects (kandang, sapi, tempat pakan, tangki air, rumput, sensor IoT, lampu, pekerja, drone / monitoring device). Jangan sekaligus semua.Plaintext SMART FARM
    LIVESTOCK MANAGEMENT

         Manage your livestock ecosystem
              from one place.

        [ Explore Dashboard ]

                  🐄
         ┌──────────────────────┐
         │       3D BARN        │
         │                      │
         │    🐄        🐄      │
         │                      │
         │        🌱 🌱         │
         └──────────────────────┘

    386 Animals 24 Barns 97% Healthy

4.  Rasio Visual Landing vs DashboardLanding Page: 70% visual / 30% informationDashboard: 30% visual / 70% information (User datang ke dashboard untuk bekerja, bukan melihat artwork).6. Layout DashboardSetelah klik Enter Management, visual berubah tetap dengan DNA yang sama.Plaintext┌────────────────────────────────────────────────────────┐
    │ 🐄 FARMOS 🔔 Admin ◉ │
    ├──────────────┬─────────────────────────────────────────┤
    │ │ │
    │ OVERVIEW │ Good morning, Budi │
    │ │ Here's your farm today. │
    │ KANDANG │ │
    │ │ ┌────────┐ ┌────────┐ ┌────────┐ │
    │ TERNAK │ │ 386 │ │ 24 │ │ 97% │ │
    │ │ │ Ternak │ │Kandang │ │ Sehat │ │
    │ PAKAN │ └────────┘ └────────┘ └────────┘ │
    │ │ │
    │ KESEHATAN │ ┌───────────────────┐ ┌────────────┐ │
    │ │ │ │ │ HEALTH │ │
    │ LAPORAN │ │ 3D BARN MAP │ │ 97% │ │
    │ │ │ │ │ ●●●●● │ │
    │ │ └───────────────────┘ └────────────┘ │
    └──────────────┴─────────────────────────────────────────┘
5.  Hirarki Depth "Semi 3D"Level 0 — Flat: text, table, label, navigationLevel 1 — Soft depth: card, button, input, dropdown (box-shadow: 0 8px 24px rgba(38, 61, 40, 0.08);)Level 2 — Elevated: important KPI, notification, selected cardLevel 3 — 3D: HANYA untuk kandang, sapi, environment, visualisasi khusus, interactive map$$\text{TEXT} \rightarrow \text{CARD} \rightarrow \text{ELEVATED CARD} \rightarrow \text{3D OBJECT}$$8. Organic Geometry RulesGunakan perpaduan organic + technical:Normal: Standard rounded corners.Organic: Custom rounded / asymmetrical layout.Blob: Hanya untuk background/decoration.Hard edge (rounded-none / rounded-sm): Dipakai untuk table, chart, technical information.9. Aturan Distribusi Warna & RatioGunakan green sebagai identity, bukan seluruh UI.BACKGROUND: #F5F2E8PRIMARY: #58763ADARK: #233629TEXT: #263026MUTED: #7C8176ACCENT: #D7A84ASUCCESS: #6E9B55WARNING: #D59A3ADANGER: #C65A4ASURFACE: #FFFFFFRasio: 60% cream/white | 25% dark/green | 10% muted green | 5% accent10. Dark Mode AnalyticsNormal Dashboard: Light / cream (#F5F2E8).Analytics Page (KHUSUS): Dark Mode (#17221C).Analytics Chart Colors: #7FAF61, #B5D88D, #D5B66A.Plaintext┌──────────────────────────────────────────┐
    │ LIVESTOCK ANALYTICS │
    │ │
    │ 386 ANIMALS │
    │ │
    │ ╱╲ ╱╲ │
    │ ╱ ╲**╱╲**╱ ╲\_\_\_ │
    │ ╱ ╲ │
    │ │
    │ HEALTH FEED GROWTH │
    └──────────────────────────────────────────┘
6.  Signature Feature: 3D Barn MapDibuat dalam bentuk 3D/isometric pada halaman kandang.Interaksi Hover: Kandang naik (scale(1.02), translateY(-8px), shadow meningkat) → Muncul info cepat (Barn A, 42 cattle, 2 sick, Temp 27°C, Feed 72%).Plaintext FARM OVERVIEW

        ┌───────────────┐
        │ 🐄 🐄 🐄      │
        │   BARN A      │
        └───────────────┘

                 ↓

    ┌───────────────┐
    │ 🐄 🐄 │
    │ BARN B │
    └───────────────┘

                 ↓

        🌱🌱🌱🌱🌱

7.  3D Interaction RulesHover Kandang: scale(1.02) + translateY(-8px) + shadow meningkat.Sapi: idle → subtle breathing animation.Sensor: ● → pulse → ●.Temperature: 27° ↑ glow kecil.❌ DILARANG: Rotate 3D terus menerus (gimmick).13. Typography Character & HierarchyHeading: Font display yang punya personality.UI: Sans-serif yang clean.Kontras Visual Contoh:SMART LIVESTOCK (Besar & bold)Barn temperature, Feed consumption, Animal health (Kecil & neutral)Layout Angka/Metric:386ANIMALS (Bukan 386 Animals)14. Navigation Sidebar StructureGunakan struktur berorientasi agrikultur:Plaintext┌────────────────────┐
    │ 🐄 FARMOS │
    │ │
    │ FARM │
    │ ◉ Overview │
    │ ◉ Barns │
    │ ◉ Livestock │
    │ │
    │ OPERATIONS │
    │ ◉ Feeding │
    │ ◉ Health │
    │ ◉ Breeding │
    │ │
    │ INSIGHTS │
    │ ◉ Analytics │
    │ ◉ Reports │
    └────────────────────┘
8.  Modular Component SystemWajib memisahkan komponen 3D dan komponen Management:Plaintext/components
    /3d
    BarnScene
    CowModel
    FarmEnvironment
    BarnMarker
    /layout
    Sidebar
    Topbar
    PageContainer
    /ui
    GlassCard
    SoftCard
    MetricCard
    StatusBadge
    FarmButton
    /charts
    HealthChart
    FeedChart
    GrowthChart
    /livestock
    AnimalCard
    AnimalStatus
    AnimalTimeline
    /barn
    BarnCard
    BarnMap
    BarnTemperature
9.  Visual Map Per Halaman/ (Farm Landing): 🌿 Cream | 🐄 3D | 🌱 Organic | ✨ Animation/dashboard (Overview): 🌿 Light | 📊 Data | 🧊 Semi-3D | 📈 Soft cards/barns (Barn Management): 🤍 Clean | 🗺️ 3D Barn Map | 📍 Interactive | 🌡️ Sensor/livestock (Animal Management): 🤍 Light | 🐄 Animal cards | 📊 Health status | 📋 Table/analytics (Farm Analytics): 🌑 Dark | 📈 Advanced charts | 🌲 3D visualization | ✨ Data storytelling/reports (Reports): 🤍 White | 📄 Editorial | 📊 Charts | 📑 Professional17. Larangan Ketat Patterns ("Jangan Bikin AI UI")❌ Gradient purple-blue❌ Glassmorphism di mana-mana❌ Semua rounded-2xl❌ Semua card punya shadow❌ Semua section centered❌ Icon lucu random❌ 5 jenis gradient❌ Semua angka dibuat glowing❌ Animasi setiap component❌ 3D object hanya sebagai pajanganGUNAKAN FORMULA:asymmetry + typography + whitespace + organic shape + restrained 3D18. Formula Visual FinalPlaintext FARMOS
    │
    ▼
    ┌─────────────────┐
    │ 3D EXPERIENCE │
    │ │
    │ 🌱 🐄 🌱 │
    │ BARN │
    └─────────────────┘
    │
    ▼
    MODERN DASHBOARD
    │
    ┌───────┼────────┐
    ▼ ▼ ▼
    FARM DATA HEALTH
    │ │ │
    └───────┼────────┘
    ▼
    DARK ANALYTICS
    Homepage: "Welcome to the farm."Dashboard: "Manage the farm."Analytics: "Understand the farm."Visual Direction Final Summary:"Organic 3D Agriculture × Editorial Information Design × Modern Data Visualization."
