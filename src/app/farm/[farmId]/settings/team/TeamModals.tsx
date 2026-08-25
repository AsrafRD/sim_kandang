'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { UserPlus, Pencil, ShieldAlert } from 'lucide-react';
import { addMemberAction, updateMemberRoleAction } from './actions';

export function AddMemberModal({ farmId }: { farmId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
        <UserPlus className="w-4 h-4" /> Add Member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Invite or add a new role to this farm.</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => { 
            startTransition(async () => {
              await addMemberAction(farmId, fd); 
              setOpen(false); 
            });
          }} 
          className="space-y-4 pt-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="Budi Santoso"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              placeholder="budi@example.com"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              name="role"
              required
              defaultValue="OPERATOR"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
            >
              <option value="OWNER">Owner</option>
              <option value="OPERATOR">Petugas Kandang (Operator)</option>
              <option value="SUPPLIER">Supplier</option>
            </select>
          </div>
          
          <div className="bg-muted p-3 rounded-md flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              New users will automatically receive the default password <strong>password123</strong>. They can change it later.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isPending ? 'Saving...' : 'Add Member'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditMemberModal({ farmId, member }: { farmId: string, member: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/10" title="Edit Profile & Role">
        <Pencil className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Member</DialogTitle>
          <DialogDescription>Change profile details and access level for {member.user.name}</DialogDescription>
        </DialogHeader>
        <form 
          action={(fd) => {
            startTransition(async () => {
              await updateMemberRoleAction(farmId, fd);
              setOpen(false);
            });
          }} 
          className="space-y-4 pt-4"
        >
          <input type="hidden" name="memberId" value={member.id} />
          
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              defaultValue={member.user.name}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              defaultValue={member.user.email}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password <span className="text-muted-foreground font-normal">(Leave blank to keep current)</span></label>
            <input 
              type="text" 
              name="newPassword"
              placeholder="Enter new password"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              name="role"
              required
              defaultValue={member.role}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
            >
              <option value="OWNER">Owner</option>
              <option value="OPERATOR">Petugas Kandang (Operator)</option>
              <option value="SUPPLIER">Supplier</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isPending ? 'Updating...' : 'Update Member'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
