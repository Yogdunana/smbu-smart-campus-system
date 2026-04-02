'use client';

import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  User,
  GraduationCap,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/schedule', icon: Calendar, labelKey: 'schedule' },
  { href: '/organization', icon: Building2, labelKey: 'organization' },
  { href: '/profile', icon: User, labelKey: 'profile' },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const t = useTranslations('nav');
  const tApp = useTranslations('common');
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={onNavigate}
        >
          <GraduationCap className="h-7 w-7 text-blue-600" />
          <span className="font-bold text-lg">{tApp('appName')}</span>
        </Link>
        {onNavigate && (
          <Button variant="ghost" size="sm" onClick={onNavigate} className="h-9 w-9 p-0">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{t(item.labelKey as any)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
      <SidebarContent />
    </aside>
  );
}
