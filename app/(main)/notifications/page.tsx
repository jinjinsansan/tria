import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/app/actions/notifications';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatDateTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: '通知センター | tria Japan Salon',
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, content, link, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to load notifications', error);
  }

  const notifications = data ?? [];
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Notifications</p>
          <h1 className="text-3xl font-semibold text-white">通知センター</h1>
          <p className="text-sm text-muted-foreground">
            未読 {unreadCount} 件 / 総件数 {notifications.length} 件
          </p>
        </div>
        <form action={markAllNotificationsReadAction}>
          <button
            type="submit"
            className={buttonVariants({ variant: 'outline' })}
            disabled={unreadCount === 0}
          >
            すべて既読にする
          </button>
        </form>
      </header>

      <div className="space-y-4">
        {notifications.length ? (
          notifications.map((notification) => {
            const isExternalLink = notification.link?.startsWith('http');
            return (
              <div
                key={notification.id}
                className={cn(
                  'rounded-3xl border p-5 shadow-sm transition',
                  notification.is_read
                    ? 'border-white/10 bg-white/5'
                    : 'border-primary/30 bg-primary/5'
                )}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wide">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                        {notification.type ?? 'info'}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDateTime(notification.created_at)}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{notification.title}</p>
                      {notification.content ? (
                        <p className="text-sm text-muted-foreground">{notification.content}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm md:items-end">
                    {notification.link ? (
                      isExternalLink ? (
                        <a
                          href={notification.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          詳細を見る
                        </a>
                      ) : (
                        <Link
                          href={notification.link}
                          className="text-primary underline underline-offset-4"
                        >
                          詳細を見る
                        </Link>
                      )
                    ) : null}
                    {!notification.is_read ? (
                      <form action={markNotificationReadAction}>
                        <input type="hidden" name="notification_id" value={notification.id} />
                        <button
                          type="submit"
                          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                        >
                          既読にする
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-muted-foreground">既読済み</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-semibold text-white">通知はまだありません。</p>
            <p className="text-sm text-muted-foreground">コミュニティへの参加や貢献で通知が届きます。</p>
          </div>
        )}
      </div>
    </div>
  );
}
