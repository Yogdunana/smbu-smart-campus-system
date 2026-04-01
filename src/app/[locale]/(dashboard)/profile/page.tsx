import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Heart,
  Star,
  Award,
  ShieldCheck,
} from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();
  const t = await getTranslations('profile');
  const user = session?.user as any;

  const profile = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      profileStatus: true,
      volunteerNumber: true,
      _count: {
        select: {
          skillTags: true,
          awards: true,
          volunteerRecords: true,
        },
      },
    },
  });

  if (!profile) {
    return <div className="text-center py-10 text-muted-foreground">{t('noData', undefined) || 'User not found'}</div>;
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  const sections = [
    { href: '/profile/basic', icon: User, label: t('basicInfo'), desc: t('name') + ' / ' + t('phone') + ' / ' + t('email') },
    { href: '/profile/identity', icon: CreditCard, label: t('identityInfo'), desc: t('grade') + ' / ' + t('department') + ' / ' + t('major') },
    { href: '/profile/volunteer', icon: Heart, label: t('volunteerLink'), desc: profile.volunteerNumber || t('volunteerNotBound') },
    { href: '/profile/skills', icon: Star, label: t('skillTags'), desc: `${profile._count.skillTags} ${t('skillTags')}` },
    { href: '/profile/awards', icon: Award, label: t('awards'), desc: `${profile._count.awards} ${t('awards')}` },
  ];

  const isCommittee = user?.role === 'COMMITTEE';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('studentId')}: {user?.studentId}
          </p>
        </div>
        <Badge className={statusColors[profile.profileStatus] || ''} variant="secondary">
          {t(`reviewStatus.${profile.profileStatus.toLowerCase()}` as any)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                  <section.icon className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-base font-medium">{section.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {isCommittee && (
        <Link href="/profile/review">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-base font-medium">{t('review')}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      )}
    </div>
  );
}
