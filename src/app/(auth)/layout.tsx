export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-heading">
            SMART <span className="text-primary">FARM</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Agricultural Intelligence Dashboard
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
