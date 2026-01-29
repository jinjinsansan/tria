import Link from 'next/link';

import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#04050C]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
        <Logo />
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <Link href="/privacy" className="hover:text-white">
            プライバシー
          </Link>
          <Link href="/terms" className="hover:text-white">
            利用規約
          </Link>
          <Link href="/contact" className="hover:text-white">
            お問い合わせ
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} tria Japan Salon
        </p>
      </div>
    </footer>
  );
}
