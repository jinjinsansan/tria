import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 text-lg font-semibold text-white transition hover:opacity-90',
        className
      )}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-base font-extrabold text-background shadow-[0_10px_30px_rgba(255,154,60,0.45)]">
        tr
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-semibold text-white">tria</span>
        <span className="text-xs font-medium text-muted-foreground">Japan Salon</span>
      </div>
    </Link>
  );
}
