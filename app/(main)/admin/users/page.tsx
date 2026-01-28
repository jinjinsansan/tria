import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
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

  const keyword = typeof searchParams?.q === 'string' ? searchParams.q : '';
  let query = supabase
    .from('users')
    .select('id, display_name, email, contribution_points, total_downlines, is_admin, created_at, last_login_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (keyword) {
    query = query.ilike('email', `%${keyword}%`);
  }

  const { data: users } = await query;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
        <h1 className="text-3xl font-semibold text-white">ユーザー管理</h1>
        <p className="text-sm text-muted-foreground">検索して貢献度やステータスを確認できます。</p>
      </header>

      <form method="get" className="flex flex-wrap gap-3">
        <Input name="q" placeholder="メールアドレスで検索" defaultValue={keyword} className="max-w-xs" />
        <button type="submit" className={buttonVariants({ variant: 'outline' })}>
          検索
        </button>
      </form>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
          <CardDescription>直近50件まで表示</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {users?.length ? (
            users.map((member) => (
              <div key={member.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white">{member.display_name ?? member.email}</p>
                <p className="text-xs">{member.email}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs">
                  <span>貢献度 {member.contribution_points ?? 0}pt</span>
                  <span>ダウンライン {member.total_downlines ?? 0}</span>
                  <span>{member.is_admin ? '管理者' : 'メンバー'}</span>
                  <span>登録日 {member.created_at?.slice(0, 10)}</span>
                </div>
              </div>
            ))
          ) : (
            <p>ユーザーが見つかりません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
