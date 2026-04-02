import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckSquare, Award, Building2, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations('dashboard');

  const user = session?.user as any;
  const isCommittee = user?.role === 'COMMITTEE';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('welcome', { name: user?.name || 'User' })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isCommittee ? t('committeeView') : t('studentView')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('todayCourses')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">{t('noCourses')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingTasks')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t('noTasks')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recentVolunteer')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 {t('hours', { hours: '' })}</div>
            <p className="text-xs text-muted-foreground">{t('totalVolunteerHours')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isCommittee ? t('orgOverview') : t('profileCompletion')}
            </CardTitle>
            {isCommittee ? (
              <Building2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Award className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCommittee ? '5' : '75%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isCommittee ? t('activeOrgs') : t('profileCompletionDetail')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
