import { redirect } from 'next/navigation';

import { ContributionSettingsForm } from '@/components/admin/contribution-settings-form';
import { PlacementSettingsForm } from '@/components/admin/placement-settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContributionSettings, getPlacementSettings } from '@/lib/data/settings';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: '設定管理 | 管理者パネル',
};

export default async function AdminSettingsPage() {
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

  const [placementSettings, contributionSettings] = await Promise.all([
    getPlacementSettings(),
    getContributionSettings(),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
        <h1 className="text-3xl font-semibold text-white">設定管理</h1>
        <p className="text-sm text-muted-foreground">オートプレースメントと貢献度ポイントの配分を調整できます。</p>
      </header>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>プレースメント配分</CardTitle>
          <CardDescription>管理者と一般メンバーへの割り当て比率を設定します。</CardDescription>
        </CardHeader>
        <CardContent>
          <PlacementSettingsForm defaultRatio={placementSettings.admin_ratio} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>貢献度ポイント</CardTitle>
          <CardDescription>アクションごとの加点ルールを調整して、コミュニティの行動を最適化します。</CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionSettingsForm defaultValues={contributionSettings} />
        </CardContent>
      </Card>
    </div>
  );
}
