import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'tria Japan Salon - 日本一triaを学べる無料オンラインサロン',
  description: 'triaの使い方を日本語で最も詳しく解説。初心者でも安心して学べるコミュニティで、メンバー同士が助け合いながら成長できます。',
  keywords: ['tria', '暗号資産', 'クリプト', 'ウォレット', 'Visaカード', 'オンラインサロン'],
  openGraph: {
    title: 'tria Japan Salon',
    description: '日本一triaを学べる無料オンラインサロン',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
