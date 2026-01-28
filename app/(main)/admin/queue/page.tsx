import Link from 'next/link';

import { assignQueueItemAction } from '@/app/actions/placement';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQueueStats, getRecentQueueItems } from '@/lib/data/placement';
import { cn, formatDateTime } from '@/lib/utils';

export const metadata = {
  title: 'オーガニック割り振り | 管理者パネル',
};

export default async function AdminQueuePage() {
  const [stats, queueItems] = await Promise.all([getQueueStats(), getRecentQueueItems()]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
        <h1 className="text-3xl font-semibold text-white">オーガニック割り振り</h1>
        <p className="text-sm text-muted-foreground">
          オーガニック流入のキュー状況を確認し、必要に応じて手動で割り振りを実行できます。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Queue</CardTitle>
            <CardDescription>未割り振りのオーガニック訪問者数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-white">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned</CardTitle>
            <CardDescription>今までに割り振られた人数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-white">{stats.assigned}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>最新のキュー</CardTitle>
          <CardDescription>最近の訪問者と状態</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {queueItems.length ? (
            queueItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/10 px-2 py-0.5">{item.source ?? 'organic'}</span>
                  <span>訪問日時：{formatDateTime(item.created_at)}</span>
                  <span>状態：{item.status}</span>
                  {item.assigned_at ? (
                    <span>割り当て：{formatDateTime(item.assigned_at)}</span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p>Visitor ID: {item.visitor_id}</p>
                    <p>
                      割り当て先：{item.assigned_user?.display_name ?? '未決定'}
                    </p>
                  </div>
                  {item.status === 'pending' ? (
                    <form action={assignQueueItemAction}>
                      <input type="hidden" name="queue_id" value={item.id} />
                      <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} type="submit">
                        手動で割り当て
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">現在キューは空です。</p>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <Link href="/go/tria" className="text-primary hover:underline">
          /go/tria ルート
        </Link>
        からのアクセスが自動的にここへ登録されます。
      </div>
    </div>
  );
}
