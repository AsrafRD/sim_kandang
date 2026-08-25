'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Selamat Datang Kembali</CardTitle>
        <CardDescription>
          Masuk untuk mengakses dasbor peternakan Anda.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="operator@kandang.com" 
              required 
              className="bg-background/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Kata Sandi</Label>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-background/50 border-border"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={isPending}
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
