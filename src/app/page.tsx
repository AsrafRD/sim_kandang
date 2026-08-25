import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { ArrowUpRight, CloudSun, Map, Activity, ShieldCheck, ThermometerSun, Leaf, Droplet, User, UserPlus } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';

export default async function Home() {
  const session = await verifySession();



  return (
    <div className="min-h-screen bg-[#F5F2E8] text-[#263026] selection:bg-[#58763A] selection:text-white pb-12">
      {/* Navbar / Top Bar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#58763A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#58763A]/20">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-[#17221C]">FARMOS</span>
          <span className="bg-[#58763A]/10 text-[#58763A] px-2 py-0.5 rounded-full text-xs font-bold border border-[#58763A]/20">{APP_VERSION}</span>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <form action={async () => { 'use server'; import('@/lib/auth/session').then(m => m.deleteSession()); redirect('/login'); }}>
                <button type="submit" className="hidden sm:flex items-center gap-2 font-medium text-[#7C8176] hover:text-[#C65A4A] transition-colors px-4 py-2">
                  Logout
                </button>
              </form>
              <Link href="/farm/router" className="flex items-center gap-2 bg-[#233629] text-[#F5F2E8] px-5 py-2.5 rounded-full font-medium hover:bg-[#17221C] transition-all shadow-md">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:flex items-center gap-2 font-medium text-[#7C8176] hover:text-[#58763A] transition-colors px-4 py-2">
                <User className="w-4 h-4" />
                Masuk
              </Link>
              <Link href="/register" className="flex items-center gap-2 bg-[#233629] text-[#F5F2E8] px-5 py-2.5 rounded-full font-medium hover:bg-[#17221C] transition-all shadow-md">
                <UserPlus className="w-4 h-4" />
                Daftar Sekarang
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-4">
        
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-[#17221C] tracking-tight">
            Halo, Agripreneur 👋
          </h1>
          <p className="text-[#7C8176] text-lg mt-3 font-medium max-w-xl">
            Selamat datang di masa depan manajemen peternakan. Optimalkan performa kandang Anda dengan pemantauan data presisi tinggi.
          </p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
          
          {/* Main Hero Card (Span 8 cols, 2 rows) */}
          <div className="md:col-span-8 row-span-2 relative rounded-3xl overflow-hidden bg-white shadow-sm border border-[#E6E2D6] group">
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 bg-[#58763A]/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50 mix-blend-multiply" />
            
            <div className="relative h-full flex flex-col justify-between p-8 md:p-10 z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7A84A]/20 text-[#D7A84A] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D7A84A]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Ekosistem Pintar
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#17221C] leading-tight max-w-md">
                  Kendalikan <br/> Lingkungan Anda.
                </h2>
                <p className="text-[#7C8176] mt-4 max-w-sm">
                  Pantau kesehatan ternak, konversi pakan (FCR), dan maksimalkan Indeks Prestasi (IP) dengan sistem terpadu.
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-8">
                <Link href="/register" className="bg-[#58763A] hover:bg-[#46602e] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-[#58763A]/25 transition-all flex items-center gap-2">
                  Mulai Sekarang <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="bg-[#E6E2D6] hover:bg-[#d6cfbe] text-[#233629] px-6 py-4 rounded-2xl font-semibold transition-all">
                  Dashboard Utama
                </Link>
              </div>
            </div>

            {/* Decorative Element mimicking 3D Farm Model */}
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-gradient-to-br from-[#E6E2D6] to-[#F5F2E8] rounded-full border-[12px] border-white shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
              <div className="text-center">
                <div className="text-6xl mb-2">🚜</div>
                <div className="font-heading font-bold text-[#58763A]">FARM-OS</div>
              </div>
            </div>
          </div>

          {/* Weather / Environment Card (Span 4 cols, 1 row) */}
          <div className="md:col-span-4 row-span-1 bg-[#233629] text-[#F5F2E8] rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#58763A] opacity-20 rounded-bl-full" />
            <div className="flex justify-between items-start z-10">
              <div>
                <h3 className="text-4xl font-light">28°<span className="text-xl">C</span></h3>
                <p className="text-[#E6E2D6] opacity-80 mt-1">Rentang Optimal</p>
              </div>
              <CloudSun className="w-10 h-10 text-[#D7A84A]" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 z-10 text-center text-sm pt-4 border-t border-[#F5F2E8]/10 mt-4">
              <div>
                <p className="text-xs opacity-60">12PM</p>
                <p className="font-medium mt-1">30°</p>
              </div>
              <div>
                <p className="text-xs opacity-60">3PM</p>
                <p className="font-medium mt-1">31°</p>
              </div>
              <div>
                <p className="text-xs opacity-60">6PM</p>
                <p className="font-medium mt-1">29°</p>
              </div>
              <div>
                <p className="text-xs opacity-60">9PM</p>
                <p className="font-medium mt-1">26°</p>
              </div>
            </div>
          </div>

          {/* Feature Card 1: 3D Mapping (Span 2 cols, 1 row) */}
          <div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-6 shadow-sm border border-[#E6E2D6] flex flex-col justify-center items-center text-center hover:bg-[#F9F8F4] transition-colors cursor-default">
            <div className="w-12 h-12 bg-[#D7A84A]/10 text-[#D7A84A] rounded-2xl flex items-center justify-center mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#17221C]">Visualisasi Interaktif</h4>
            <p className="text-xs text-[#7C8176] mt-2 leading-relaxed">Pemantauan area spasial kandang.</p>
          </div>

          {/* Feature Card 2: Analytics (Span 2 cols, 1 row) */}
          <div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-6 shadow-sm border border-[#E6E2D6] flex flex-col justify-center items-center text-center hover:bg-[#F9F8F4] transition-colors cursor-default">
            <div className="w-12 h-12 bg-[#C65A4A]/10 text-[#C65A4A] rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#17221C]">Analitik Mendalam</h4>
            <p className="text-xs text-[#7C8176] mt-2 leading-relaxed">Dasbor komando dengan Dark Mode.</p>
          </div>

        </div>
      </main>

    </div>
  );
}
