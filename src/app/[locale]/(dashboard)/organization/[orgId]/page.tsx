'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, ArrowLeft, UserPlus, Send } from 'lucide-react';
import Link from 'next/link';

interface OrgDetail {
  id: string;
  fullName: string;
  shortName: string;
  nature: string;
  status: string;
  description: string;
  teacherAdvisor: string;
  leaders: { id: string; user: { name: string; studentId: string } }[];
  departments: { id: string; name: string }[];
  tasks: { id: string; title: string; status: string; type: string; priority: string; deadline: string }[];
}

export default function OrgDetailPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const t = useTranslations('organization');
  const tCommon = useTranslations('common');
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', type: 'SINGLE_DEPT', priority: 'MEDIUM', deadline: '' });

  const fetchOrg = async () => {
    const res = await fetch(`/api/organization/${orgId}`);
    if (res.ok) setOrg(await res.json());
  };

  useEffect(() => { fetchOrg(); }, [orgId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/organization/${orgId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });
      if (res.ok) {
        toast.success(t('taskCreated'));
        setTaskDialogOpen(false);
        setTaskForm({ title: '', description: '', type: 'SINGLE_DEPT', priority: 'MEDIUM', deadline: '' });
        fetchOrg();
      }
    } catch { toast.error(tCommon('error')); }
  };

  const statusLabel = (s: string) => t(`taskStatus.${s}` as any) || s;
  const typeLabel = (tp: string) => {
    switch (tp) {
      case 'SINGLE_DEPT': return t('singleDept');
      case 'CROSS_DEPT': return t('crossDept');
      case 'HIERARCHICAL': return t('hierarchical');
      default: return tp;
    }
  };

  const statusColors: Record<string, string> = {
    PENDING_VIEW: 'bg-gray-100 text-gray-700',
    VIEWED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
  };

  if (!org) return <div className="text-center py-10 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/organization">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{org.shortName}</h1>
          <p className="text-muted-foreground text-sm">{org.fullName}</p>
        </div>
        <Badge variant={org.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {org.status === 'ACTIVE' ? t('active') : t('suspended')}
        </Badge>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">{t('tasks')}</TabsTrigger>
          <TabsTrigger value="members">{t('members')}</TabsTrigger>
          <TabsTrigger value="departments">{t('departments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="flex justify-end mb-4">
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger>
                <Button><Plus className="mr-2 h-4 w-4" />{t('taskTitle')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('taskTitle')}</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('taskTitle')} <span className="text-red-500">*</span></Label>
                    <Input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('taskDescription')}</Label>
                    <Textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t('taskType')}</Label>
                      <Select value={taskForm.type} onValueChange={(v) => setTaskForm({ ...taskForm, type: v || 'SINGLE_DEPT' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE_DEPT">{t('singleDept')}</SelectItem>
                          <SelectItem value="CROSS_DEPT">{t('crossDept')}</SelectItem>
                          <SelectItem value="HIERARCHICAL">{t('hierarchical')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{tCommon('priority')}</Label>
                      <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v || 'MEDIUM' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">低</SelectItem>
                          <SelectItem value="MEDIUM">中</SelectItem>
                          <SelectItem value="HIGH">高</SelectItem>
                          <SelectItem value="URGENT">紧急</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{tCommon('status')}</Label>
                      <Input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">{tCommon('submit')}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {org.tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t('noTasks')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('taskTitle')}</TableHead>
                  <TableHead>{t('taskType')}</TableHead>
                  <TableHead>{tCommon('status')}</TableHead>
                  <TableHead>{tCommon('priority')}</TableHead>
                  <TableHead>{tCommon('createdAt')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {org.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell><Badge variant="outline">{typeLabel(task.type)}</Badge></TableCell>
                    <TableCell><Badge className={statusColors[task.status] || ''}>{statusLabel(task.status)}</Badge></TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.deadline || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardContent className="pt-6">
              {org.leaders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{tCommon('noData')}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('studentId')}</TableHead>
                      <TableHead>{t('leader')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {org.leaders.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.user.name}</TableCell>
                        <TableCell>{l.user.studentId}</TableCell>
                        <TableCell>{t('leader')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardContent className="pt-6">
              {org.departments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{tCommon('noData')}</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {org.departments.map((d) => (
                    <Badge key={d.id} variant="secondary" className="text-sm py-1 px-3">{d.name}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
