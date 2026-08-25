'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Hash, Calendar } from 'lucide-react';
import { createFlockAction } from './actions';

export function AddFlockModal({ farmId }: { farmId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Start New Batch
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Batch</DialogTitle>
          <DialogDescription>Record incoming DOCs/Chicks.</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => {
            startTransition(async () => {
              await createFlockAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4 pt-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Batch Name</label>
            <input 
              type="text" 
              name="batchName"
              required
              placeholder="e.g. Batch Jan 2026"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Hash className="w-3 h-3 text-muted-foreground" /> Initial Count
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
              <Calendar className="w-3 h-3 text-muted-foreground" /> Chick-In Date
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
            {isPending ? 'Creating...' : 'Create Batch'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
