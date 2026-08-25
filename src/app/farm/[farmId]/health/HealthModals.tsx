'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { addHealthItemAction } from './actions';

export function AddHealthModal({ farmId }: { farmId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Daftar Obat Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daftarkan Item Medis</DialogTitle>
          <DialogDescription>Tambahkan obat atau vaksin baru ke inventaris.</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => {
            startTransition(async () => {
              await addHealthItemAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4 pt-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Nama Item</label>
            <input 
              type="text" 
              name="itemName"
              required
              placeholder="Cth. Vaksin ND-IB"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select 
                name="category"
                required
                defaultValue="OBAT"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              >
                <option value="OBAT">Obat / Vitamin</option>
                <option value="VAKSIN">Vaksin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Satuan</label>
              <select 
                name="unit"
                required
                defaultValue="BOTOL"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              >
                <option value="BOTOL">Botol / Vial</option>
                <option value="SACHET">Sachet</option>
                <option value="KG">Kilogram</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stok Awal</label>
            <input 
              type="number" 
              name="initialStock"
              defaultValue="0"
              min="0"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-semibold transition-colors mt-2"
          >
            {isPending ? 'Menyimpan...' : 'Simpan Obat'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
