import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { getAdminOverview, getRecentPlacements } from '@/lib/data/admin';
import { cn, formatDateTime } from '@/lib/utils';

export const metadata = {
  title: '管理者ダッシュボード | tria Japan Salon',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).maybeSingle();

  if (!profile?.is_admin) {
    redirect('/');
  }

  const [overview, placements] = await Promise.all([getAdminOverview(), getRecentPlacements()]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
          <h1 className="text-3xl font-semibold text-white">ダッシュボード</h1>
          <p className="text-sm text-muted-foreground">
            コミュニティ成長とプレースメント状況を確認できます。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles" className={buttonVariants({ variant: 'outline' })}>
            記事管理
          </Link>
          <Link href="/admin/queue" className={buttonVariants({ variant: 'gradient' })}>
            プレースメント管理
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '総ユーザー', value: overview.totalUsers },
          { label: '直近1週間', value: overview.newUsersWeek },
          { label: '直近1か月', value: overview.newUsersMonth },
          { label: 'キュー待ち', value: overview.queuePending },
        ].map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-card/80">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>貢献度ランキング</CardTitle>
            <CardDescription>上位 5 名の貢献度とダウンライン</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.topUsers.length ? (
              overview.topUsers.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-white">
                      #{index + 1} {member.display_name ?? '匿名'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      貢献度 {member.contribution_points ?? 0}pt / ダウンライン {member.total_downlines ?? 0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">ランキングデータがまだありません。</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>最近のプレースメント</CardTitle>
            <CardDescription>直近で割り振られたオーガニック訪問者</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {placements.length ? (
              placements.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-white">訪問者: {item.visitor_id}</p>
                  <p>割り当て先: {item.assigned_user?.display_name ?? '不明'}</p>
                  <p>日時: {item.assigned_at ? formatDateTime(item.assigned_at) : '-'}</p>
                </div>
              ))
            ) : (
              <p>割り振り履歴がありません。</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
