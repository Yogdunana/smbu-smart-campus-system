import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckSquare, Award, Building2, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations('dashboard');

  const user = session?.user as any;
  const isCommittee = user?.role === 'COMMITTEE';
  const userId = user?.id;

  // Fetch real data in parallel
  const [
    todayPlans,
    pendingTasks,
    volunteerStats,
    activeOrgs,
    pendingReviews,
  ] = await Promise.all([
    // Today's plans
    userId
      ? prisma.plan.count({
          where: {
            userId,
            startTime: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        })
      : 0,

    // Pending tasks (PENDING + IN_PROGRESS)
    userId
      ? prisma.personalTask.count({
          where: {
            userId,
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        })
      : 0,

    // Total volunteer hours (approved records)
    userId
      ? prisma.volunteerRecord.aggregate({
          where: {
            userId,
            status: 'APPROVED',
          },
          _sum: { hours: true },
        })
      : { _sum: { hours: 0 } },

    // Active organizations (for committee view)
    isCommittee
      ? prisma.organization.count({
          where: { status: 'ACTIVE' },
        })
      : Promise.resolve(0),

    // Pending profile reviews (for committee view)
    isCommittee
      ? prisma.user.count({
          where: { profileStatus: 'PENDING_REVIEW' },
        })
      : Promise.resolve(0),
  ]);

  const totalHours = Number(volunteerStats._sum.hours || 0);

  // Calculate profile completion for students
  let profileCompletion = 0;
  if (!isCommittee && userId) {
    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true, email: true, phone: true, gender: true,
        ethnicity: true, grade: true, department: true, major: true,
        className: true, volunteerNumber: true, photoUrl: true,
      },
    });
    if (fullUser) {
      const fields = [
        fullUser.name, fullUser.email, fullUser.phone, fullUser.gender,
        fullUser.ethnicity, fullUser.grade, fullUser.department, fullUser.major,
        fullUser.className, fullUser.volunteerNumber, fullUser.photoUrl,
      ];
      const filled = fields.filter(Boolean).length;
      profileCompletion = Math.round((filled / fields.length) * 100);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t('welcome', { name: user?.name || 'User' })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isCommittee ? t('committeeView') : t('studentView')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Plans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('todayCourses')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPlans}</div>
            <p className="text-xs text-muted-foreground">
              {todayPlans > 0
                ? t('todayPlanCount', { count: todayPlans })
                : t('noCourses')}
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingTasks')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks > 0
                ? t('pendingTaskCount', { count: pendingTasks })
                : t('noTasks')}
            </p>
          </CardContent>
        </Card>

        {/* Volunteer Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recentVolunteer')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours} {t('hours', { hours: '' })}
            </div>
            <p className="text-xs text-muted-foreground">{t('totalVolunteerHours')}</p>
          </CardContent>
        </Card>

        {/* Committee: Active Orgs / Student: Profile Completion */}
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
              {isCommittee ? activeOrgs : `${profileCompletion}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isCommittee
                ? t('activeOrgCount', { count: activeOrgs })
                : t('profileCompletionDetail')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Committee: Pending Reviews Card */}
      {isCommittee && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingReview')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              {pendingReviews > 0
                ? t('pendingReviewCount', { count: pendingReviews })
                : t('noPendingReviews')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
