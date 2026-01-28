import { AuthCard } from '@/components/auth/auth-card';
import { SignupForm } from '@/components/auth/signup-form';

interface SignupPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const referralCode =
    typeof searchParams?.ref === 'string'
      ? searchParams.ref.toUpperCase()
      : undefined;

  return (
    <div className="w-full">
      <AuthCard
        title="無料で参加する"
        description="triaの最新情報と学習コンテンツ、コミュニティサポートに今すぐアクセス"
      >
        <div className="space-y-6">
          <SignupForm defaultReferralCode={referralCode} />
        </div>
      </AuthCard>
    </div>
  );
}
