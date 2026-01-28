import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

interface LoginPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const status = typeof searchParams?.status === 'string' ? searchParams.status : undefined;

  return (
    <div className="w-full">
      <AuthCard
        title="サロンにログイン"
        description="tria学習サロンに参加して、最新情報やコミュニティ機能を利用しましょう"
      >
        <div className="space-y-6">
          {status === 'check-email' ? (
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-primary-foreground">
              入力いただいたメールアドレス宛に確認メールを送信しました。リンクをクリックして登録を完了してください。
            </div>
          ) : null}
          <LoginForm />
        </div>
      </AuthCard>
    </div>
  );
}
