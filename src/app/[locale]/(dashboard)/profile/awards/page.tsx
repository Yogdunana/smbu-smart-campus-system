'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Award {
  id: string;
  title: string;
  level: string;
  awardDate: string;
  description: string;
  certificateUrl: string;
  status: string;
}

export default function AwardsPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [awards, setAwards] = useState<Award[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', level: '', awardDate: '', description: '' });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    const res = await fetch('/api/profile/awards');
    if (res.ok) {
      const data = await res.json();
      setAwards(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(t('addAward') + ' ✓');
        setDialogOpen(false);
        setForm({ title: '', level: '', awardDate: '', description: '' });
        fetchAwards();
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/awards?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(tCommon('delete') + ' ✓');
        fetchAwards();
      }
    } catch {
      toast.error(tCommon('error'));
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default' as const;
      case 'REJECTED': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('awards')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button><Plus className="mr-2 h-4 w-4" />{t('addAward')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('addAward')}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('awardTitle')} <span className="text-red-500">*</span></Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('awardLevel')}</Label>
                  <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="校级/市级/省级/国家级" />
                </div>
                <div className="space-y-2">
                  <Label>{t('awardDate')}</Label>
                  <Input type="date" value={form.awardDate} onChange={(e) => setForm({ ...form, awardDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('awardDescription')}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{tCommon('submit')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {awards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t('noAwards')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('awardTitle')}</TableHead>
                  <TableHead>{t('awardLevel')}</TableHead>
                  <TableHead>{t('awardDate')}</TableHead>
                  <TableHead>{tCommon('status')}</TableHead>
                  <TableHead>{tCommon('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awards.map((award) => (
                  <TableRow key={award.id}>
                    <TableCell className="font-medium">{award.title}</TableCell>
                    <TableCell>{award.level || '-'}</TableCell>
                    <TableCell>{award.awardDate ? format(new Date(award.awardDate), 'yyyy-MM-dd') : '-'}</TableCell>
                    <TableCell><Badge variant={statusVariant(award.status)}>{award.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(award.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
