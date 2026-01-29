'use client';

import { Bell, Download } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Logo } from './logo';
import { MobileNav } from './site-mobile-nav';

export interface HeaderUser {
  id: string;
  email?: string | null;
  displayName?: string | null;
  contributionPoints?: number | null;
  totalDownlines?: number | null;
  unreadNotifications?: number | null;
}

const navItems = [
  { label: 'ホーム', href: '/' },
  { label: 'ラーニング', href: '/learn' },
  { label: 'コミュニティ', href: '/feed' },
  { label: 'ツール', href: '/ai' },
  { label: 'アカウント', href: '/settings' },
];

interface SiteHeaderProps {
  user: HeaderUser | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#04050C]/80 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Logo />

        <nav className="hidden flex-1 items-center justify-center gap-2 text-sm text-muted-foreground lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 font-medium transition',
                  isActive
                  ? 'bg-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.35)]'
                  : 'hover:text-white'
              )}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="gradient"
            size="sm"
            className="hidden rounded-full text-xs font-semibold text-black md:inline-flex"
          >
            <a href="https://app.tria.so" target="_blank" rel="noreferrer">
              <Download className="mr-2 h-3.5 w-3.5" />アプリをダウンロード
            </a>
          </Button>

          {user ? (
            <>
              <Link
                href="/notifications"
                aria-label="通知"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-white/30"
              >
                <Bell className="h-5 w-5" />
                {user.unreadNotifications ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-background">
                    {user.unreadNotifications > 9 ? '9+' : user.unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-right text-xs text-muted-foreground">
                <p className="text-sm font-semibold text-white">
                  {user.displayName ?? user.email}
                </p>
                <span>貢献度 {user.contributionPoints ?? 0}pt</span>
              </div>
              <SignOutButton className="rounded-full px-4" variant="ghost" size="sm" />
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                ログイン
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: 'gradient', size: 'sm' }), 'rounded-full text-black')}
              >
                無料登録
              </Link>
            </>
          )}
        </div>

        <MobileNav navItems={navItems} user={user} />
      </div>
    </header>
  );
}
