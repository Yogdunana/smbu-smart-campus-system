'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Building2, Users, CheckSquare } from 'lucide-react';
import Link from 'next/link';

interface Org {
  id: string;
  fullName: string;
  shortName: string;
  nature: string;
  status: string;
  description: string;
  _count: { leaders: number; tasks: number; departments: number };
}

export default function OrganizationPage() {
  const t = useTranslations('organization');
  const tCommon = useTranslations('common');
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', shortName: '', nature: 'STUDENT_ORG', description: '', teacherAdvisor: '' });

  const fetchOrgs = async () => {
    const res = await fetch('/api/organization');
    if (res.ok) setOrgs(await res.json());
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(t('orgCreated'));
        setDialogOpen(false);
        setForm({ fullName: '', shortName: '', nature: 'STUDENT_ORG', description: '', teacherAdvisor: '' });
        fetchOrgs();
      } else toast.error(tCommon('error'));
    } catch { toast.error(tCommon('error')); }
  };

  const natureLabel = (n: string) => t(`natureOptions.${n}` as any) || n;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button><Plus className="mr-2 h-4 w-4" />{t('createOrg')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('createOrg')}</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('orgFullName')} <span className="text-red-500">*</span></Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('orgShortName')} <span className="text-red-500">*</span></Label>
                  <Input value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('orgNature')}</Label>
                  <Select value={form.nature} onValueChange={(v) => setForm({ ...form, nature: v || 'STUDENT_ORG' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT_ORG">{natureLabel('STUDENT_ORG')}</SelectItem>
                      <SelectItem value="FACULTY_DEPT">{natureLabel('FACULTY_DEPT')}</SelectItem>
                      <SelectItem value="ADMIN_DEPT">{natureLabel('ADMIN_DEPT')}</SelectItem>
                      <SelectItem value="VOLUNTEER_ORG">{natureLabel('VOLUNTEER_ORG')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('teacherAdvisor')}</Label>
                <Input value={form.teacherAdvisor} onChange={(e) => setForm({ ...form, teacherAdvisor: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('orgName')}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{tCommon('submit')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {orgs.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">{t('noOrgs')}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organization/${org.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{org.shortName}</CardTitle>
                    <Badge variant={org.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {org.status === 'ACTIVE' ? t('active') : t('suspended')}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{org.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{natureLabel(org.nature)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{org._count.leaders}</span>
                    <span className="flex items-center gap-1"><CheckSquare className="h-3.5 w-3.5" />{org._count.tasks}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
