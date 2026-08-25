'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { addFeedItemAction } from './actions';

export function AddFeedModal({ farmId }: { farmId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Feed Type
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Feed Type</DialogTitle>
          <DialogDescription>Add a new type of feed to your warehouse.</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => {
            startTransition(async () => {
              await addFeedItemAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4 pt-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Feed Name</label>
            <input 
              type="text" 
              name="itemName"
              required
              placeholder="e.g. Starter Crumble X-1"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select 
                name="unit"
                required
                defaultValue="KG"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              >
                <option value="KG">Kilogram (KG)</option>
                <option value="KARUNG">Karung (Sack)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initial Stock</label>
              <input 
                type="number" 
                name="initialStock"
                defaultValue="0"
                min="0"
                step="0.01"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-semibold transition-colors mt-2"
          >
            {isPending ? 'Saving...' : 'Save Item'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
