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
}

const navItems = [
  { label: 'ダッシュボード', href: '/' },
  { label: '学ぶ', href: '/learn' },
  { label: 'フィード', href: '/feed' },
  { label: 'AI補助', href: '/ai' },
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

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
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
