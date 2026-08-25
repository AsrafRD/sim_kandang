---
name: pwa-offline-first
description: Pedoman pembuatan komponen input harian offline-ready dan touch-friendly UX
---

# PWA Offline-First Skill

## UX Rules for Operators

1. **Touch-Friendly Controls:**
   - Gunakan komponen `Drawer` (bukan modal kecil) pada tampilan mobile.
   - Ukuran tombol minimal `h-12` (48px) agar mudah ditekan jari di lapangan.
   - Gunakan `input type="number"` dengan `inputmode="numeric"` dan tombol Stepper (+/-) berukuran besar.

2. **Local Storage Fallback:**
   - Jika koneksi offline/lambat, simpan draf input harian ke `IndexedDB` atau `localStorage` terlebih dahulu.
   - Tampilkan indikator status sinkronisasi: `Tersimpan Lokal (Belum Sync)` / `Tersinkronisasi`.
