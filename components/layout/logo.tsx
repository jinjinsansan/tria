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
        'flex items-center gap-2 text-lg font-semibold text-white transition hover:opacity-90',
        className
      )}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-lg font-bold">
        tr
      </span>
      <div className="flex flex-col leading-tight">
        <span>tria Japan Salon</span>
        <span className="text-xs font-normal text-muted-foreground">
          Learn &amp; Grow Together
        </span>
      </div>
    </Link>
  );
}
