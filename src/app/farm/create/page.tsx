'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createFarmAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Warehouse, ArrowLeft, Map } from 'lucide-react';
import LocationPickerDynamic from '@/components/maps/LocationPickerDynamic';

export default function CreateFarmPage() {
  const [state, formAction, isPending] = useActionState(createFarmAction, null);

  return (
    <div className="min-h-screen bg-[#F5F2E8] flex flex-col items-center justify-center p-6 text-[#17221C]">
      <div className="w-full max-w-md">
        <Link href="/farm/router" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </Link>
        
        <Card className="shadow-lg border-none overflow-hidden">
          <div className="h-2 bg-primary w-full"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-heading">Buat Kandang Baru</CardTitle>
            <CardDescription>
              Buat unit bisnis kandang baru yang terisolasi secara data dan anggota.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              {state?.error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 font-medium">
                  {state.error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  Nama Kandang / Bisnis
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  placeholder="e.g. Kandang Berkah Jaya" 
                  required 
                  className="bg-background/50 border-border h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Peternakan</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors bg-background/50">
                    <input type="radio" name="type" value="BROILER" defaultChecked className="w-4 h-4 accent-primary" />
                    <span className="font-medium text-sm">Ayam Broiler (Pedaging)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors bg-background/50 opacity-50">
                    <input type="radio" name="type" value="LAYER" disabled className="w-4 h-4 accent-primary" />
                    <span className="font-medium text-sm">Ayam Layer (Coming Soon)</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Alamat Lengkap (Opsional)
                </Label>
                <Input 
                  id="address" 
                  name="address" 
                  type="text" 
                  placeholder="e.g. Jl. Peternakan Raya No. 12" 
                  className="bg-background/50 border-border h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4" />
                  Titik Lokasi (Maps)
                </Label>
                <LocationPickerDynamic />
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 text-base shadow-sm"
                disabled={isPending}
              >
                {isPending ? 'Membuat Kandang...' : 'Buat Kandang Sekarang'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
