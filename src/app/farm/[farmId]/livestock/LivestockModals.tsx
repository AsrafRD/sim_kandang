'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Hash, Calendar } from 'lucide-react';
import { addFlockAction, harvestFlockAction } from './actions';

export function AddFlockModal({ farmId }: { farmId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Mulai Batch Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mulai Batch Baru</DialogTitle>
          <DialogDescription>Catat penerimaan DOC/Anak ayam baru masuk kandang.</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => {
            startTransition(async () => {
              await addFlockAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4 pt-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Nama Batch</label>
            <input 
              type="text" 
              name="batchName"
              required
              placeholder="Cth. Batch Jan 2026"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Hash className="w-3 h-3 text-muted-foreground" /> Populasi Awal
            </label>
            <input 
              type="number" 
              name="initialCount"
              required
              min="1"
              placeholder="10000"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground" /> Tanggal Chick-In
            </label>
            <input 
              type="date" 
              name="chickInDate"
              required
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-semibold transition-colors mt-2"
          >
            {isPending ? 'Menyimpan...' : 'Mulai Batch'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HarvestFlockModal({ farmId, flock }: { farmId: string, flock: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalFeed = flock.dailyRecords?.reduce((acc: number, curr: any) => acc + (curr.feedConsumedKg || 0), 0) || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mt-4 w-full bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-200 py-2 rounded-lg text-sm font-bold transition-colors">
        Tutup Batch / Panen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tutup Batch / Panen</DialogTitle>
          <DialogDescription>Selesaikan siklus batch {flock.batchName} dan hitung IP serta FCR.</DialogDescription>
        </DialogHeader>

        <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-xs text-orange-800 space-y-1 mb-2 mt-2">
          <p className="font-semibold">Ringkasan Sebelum Panen:</p>
          <p>Total Pakan Terpakai: <strong>{totalFeed.toLocaleString('id-ID')} kg</strong></p>
        </div>

        <form 
          action={(fd) => {
            startTransition(async () => {
              await harvestFlockAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4"
        >
          <input type="hidden" name="flockId" value={flock.id} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Bobot Panen (Kg)</label>
              <input 
                type="number" 
                name="totalWeight"
                required
                min="0.1" step="0.1"
                placeholder="e.g. 18500"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Ekor Dipanen</label>
              <input 
                type="number" 
                name="totalCount"
                required
                min="1"
                placeholder="e.g. 9800"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Penanganan Sisa Pakan Gudang</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="leftOverAction" value="CARRY_OVER" defaultChecked className="accent-primary" />
                Carry Over (Simpan untuk Batch Berikutnya)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="leftOverAction" value="RETURN" className="accent-primary" />
                Retur ke PT (Kosongkan Gudang Pakan)
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 text-white hover:bg-orange-600 h-9 px-4 py-2 rounded-md text-sm font-semibold transition-colors mt-2"
          >
            {isPending ? 'Memproses Panen...' : 'Konfirmasi Panen'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
