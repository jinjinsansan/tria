'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { HeaderUser } from './site-header';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  navItems: { label: string; href: string }[];
  user: HeaderUser | null;
  onSignOut: () => void | Promise<void>;
}

export function MobileNav({ navItems, user, onSignOut }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="メニューを開く"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-16 z-40 mx-4 rounded-3xl border border-white/10 bg-background/95 p-6 shadow-2xl">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-xl px-4 py-3 text-base font-medium transition',
                  pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-white/5 pt-6">
            {user ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.displayName ?? user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    貢献度 {user.contributionPoints ?? 0}pt / ダウンライン{' '}
                    {user.totalDownlines ?? 0}
                  </p>
                  {typeof user.unreadNotifications === 'number' ? (
                    <p className="text-xs text-primary">
                      未読通知 {user.unreadNotifications}
                    </p>
                  ) : null}
                </div>
                <form action={onSignOut}>
                  <button
                    type="submit"
                    className={buttonVariants({ variant: 'outline', size: 'lg' })}
                  >
                    ログアウト
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: 'ghost', size: 'lg' })}
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: 'gradient', size: 'lg' })}
                >
                  無料登録
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
