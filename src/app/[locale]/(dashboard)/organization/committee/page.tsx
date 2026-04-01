'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, CheckSquare, Users, TrendingUp } from 'lucide-react';

interface OrgSummary {
  id: string;
  shortName: string;
  status: string;
  _count: { tasks: number; leaders: number; departments: number };
}

interface TaskSummary {
  id: string;
  title: string;
  status: string;
  type: string;
  organization: { shortName: string };
}

export default function CommitteePage() {
  const t = useTranslations('organization');
  const tCommon = useTranslations('common');
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);

  useEffect(() => {
    fetch('/api/organization').then(r => { if (r.ok) r.json().then(setOrgs); });
    fetch('/api/organization/tasks/all').then(r => { if (r.ok) r.json().then(setTasks); });
  }, []);

  const statusColors: Record<string, string> = {
    PENDING_VIEW: 'bg-gray-100 text-gray-700',
    VIEWED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
  };

  const statusLabel = (s: string) => t(`taskStatus.${s}` as any) || s;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('committeeView')}</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('allOrgs')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{orgs.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('taskProgress')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('taskCompletion')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{completionRate}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('members')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{orgs.reduce((s, o) => s + o._count.leaders, 0)}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">{t('taskBoard')}</TabsTrigger>
          <TabsTrigger value="orgs">{t('orgList')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="pt-6">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t('noTasks')}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('taskTitle')}</TableHead>
                      <TableHead>{t('orgName')}</TableHead>
                      <TableHead>{t('taskType')}</TableHead>
                      <TableHead>{tCommon('status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.organization?.shortName}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell><Badge className={statusColors[task.status] || ''}>{statusLabel(task.status)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orgs">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('orgName')}</TableHead>
                    <TableHead>{t('orgStatus')}</TableHead>
                    <TableHead>{t('tasks')}</TableHead>
                    <TableHead>{t('members')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.shortName}</TableCell>
                      <TableCell><Badge variant={org.status === 'ACTIVE' ? 'default' : 'secondary'}>{org.status === 'ACTIVE' ? t('active') : t('suspended')}</Badge></TableCell>
                      <TableCell>{org._count.tasks}</TableCell>
                      <TableCell>{org._count.leaders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
