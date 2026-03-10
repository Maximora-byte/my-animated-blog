import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '我的博客',
  description: '使用 Next.js 构建的个人博客',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
