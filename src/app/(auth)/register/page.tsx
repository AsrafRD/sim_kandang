'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { registerAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Create an Account</CardTitle>
        <CardDescription>
          Start managing your farm smarter today.
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
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="Budi Agrikultur" 
              required 
              className="bg-background/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="budi@kandang.com" 
              required 
              className="bg-background/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farmName">Farm Name</Label>
            <Input 
              id="farmName" 
              name="farmName" 
              type="text" 
              placeholder="Kandang Modern Sejahtera" 
              required 
              className="bg-background/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
            {isPending ? 'Creating Account...' : 'Register'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
