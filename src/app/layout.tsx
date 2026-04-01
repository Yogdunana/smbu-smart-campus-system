import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '校园智慧助手 | SMBU Smart Campus',
  description: '深圳北理莫斯科大学校园综合智慧管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
