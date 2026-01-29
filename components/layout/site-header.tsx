import { Bell } from 'lucide-react';
import Link from 'next/link';

import { signOutAction } from '@/app/actions/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { buttonVariants } from '@/components/ui/button';
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
  { label: 'ダッシュボード', href: '/' },
  { label: '学ぶ', href: '/learn' },
  { label: 'フィード', href: '/feed' },
  { label: 'AI補助', href: '/ai' },
  { label: '通知', href: '/notifications' },
  { label: '設定', href: '/settings' },
];

interface SiteHeaderProps {
  user: HeaderUser | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition hover:text-white',
                item.href === '/' ? 'text-white' : undefined
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                href="/notifications"
                aria-label="通知"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-white/30"
              >
                <Bell className="h-5 w-5" />
                {user.unreadNotifications ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                    {user.unreadNotifications > 9 ? '9+' : user.unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <div className="text-right text-xs text-muted-foreground">
                <p className="text-sm font-medium text-white">
                  {user.displayName ?? user.email}
                </p>
                <span>
                  貢献度 {user.contributionPoints ?? 0}pt
                </span>
              </div>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: 'gradient', size: 'sm' })}
              >
                無料登録
              </Link>
            </>
          )}
        </div>

        <MobileNav navItems={navItems} user={user} onSignOut={signOutAction} />
      </div>
    </header>
  );
}
