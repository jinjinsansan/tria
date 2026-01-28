import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary/30 via-background to-background opacity-70" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-primary blur-3xl opacity-10" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
