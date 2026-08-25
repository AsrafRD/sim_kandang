import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border shadow-xl bg-card">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
            <span className="text-4xl">🛑</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-heading text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">You do not have the required permissions to view this section.</p>
          </div>
          <Link 
            href="/"
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Return to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
