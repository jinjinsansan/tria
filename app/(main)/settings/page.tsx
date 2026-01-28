import { redirect } from 'next/navigation';

import { ReferralForm } from '@/components/settings/referral-form';
import { ReferralLinkCard } from '@/components/settings/referral-link-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: '設定 | tria Japan Salon',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('display_name, referral_code, tria_referral_url, contribution_points, total_downlines, created_at, last_login_at')
    .eq('id', user.id)
    .maybeSingle();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const referralLink = profile?.referral_code ? `${siteUrl}/signup?ref=${profile.referral_code}` : `${siteUrl}/signup`;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Settings</p>
        <h1 className="text-3xl font-semibold text-white">アカウント設定</h1>
        <p className="text-sm text-muted-foreground">
          紹介リンクとtria公式紹介URLを管理できます。
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>アカウント情報</CardTitle>
            <CardDescription>貢献度とダウンラインの状況</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-xs text-muted-foreground">表示名</p>
              <p className="text-lg font-semibold text-white">{profile?.display_name ?? user.email}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">貢献度ポイント</p>
                <p className="text-xl font-semibold text-white">{profile?.contribution_points ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">累計ダウンライン</p>
                <p className="text-xl font-semibold text-white">{profile?.total_downlines ?? 0}</p>
              </div>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <p>登録日：{profile?.created_at ? formatDate(profile.created_at) : '-'}</p>
              <p>最終ログイン：{profile?.last_login_at ? formatDate(profile.last_login_at) : '-'}</p>
            </div>
          </CardContent>
        </Card>

        <ReferralLinkCard referralCode={profile?.referral_code} referralUrl={referralLink} />
      </div>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>tria紹介URL</CardTitle>
          <CardDescription>
            あなた専用のtria公式紹介URLを設定すると、オートプレースメント時に自動で使用されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReferralForm defaultValue={profile?.tria_referral_url} />
        </CardContent>
      </Card>
    </div>
  );
}
