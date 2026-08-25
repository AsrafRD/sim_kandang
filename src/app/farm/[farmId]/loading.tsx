import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-accent" />
      <p className="text-muted-foreground font-medium animate-pulse">Memuat data...</p>
    </div>
  );
}
