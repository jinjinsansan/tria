import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader, type HeaderUser } from '@/components/layout/site-header';
import { createClient } from '@/lib/supabase/server';

export default async function MainLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let headerUser: HeaderUser | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('display_name, contribution_points, total_downlines')
      .eq('id', user.id)
      .maybeSingle();

    headerUser = {
      id: user.id,
      email: user.email,
      displayName:
        profile?.display_name ?? (user.user_metadata as { display_name?: string })?.display_name ?? null,
      contributionPoints: profile?.contribution_points ?? null,
      totalDownlines: profile?.total_downlines ?? null,
    };
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-primary/30 opacity-40 blur-[120px]" />
      <SiteHeader user={headerUser} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
