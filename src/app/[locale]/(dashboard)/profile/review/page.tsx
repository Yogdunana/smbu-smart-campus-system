'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Check, X, ShieldCheck } from 'lucide-react';

interface ReviewItem {
  id: string;
  studentId: string;
  name: string;
  department: string;
  profileStatus: string;
}

export default function ReviewPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [dialogType, setDialogType] = useState<'approve' | 'reject'>('approve');

  const fetchItems = async () => {
    const res = await fetch('/api/profile/review');
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAction = async () => {
    if (!selectedItem) return;
    const body: any = { userId: selectedItem.id };
    if (dialogType === 'reject') {
      body.action = 'reject';
      body.reason = rejectReason;
    } else {
      body.action = 'approve';
    }
    try {
      const res = await fetch('/api/profile/review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(dialogType === 'approve' ? t('reviewApproved') : t('reviewRejected'));
        setSelectedItem(null);
        setRejectReason('');
        fetchItems();
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          {t('review')}
        </h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{tCommon('noData')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('studentId')}</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('department')}</TableHead>
                  <TableHead>{tCommon('status')}</TableHead>
                  <TableHead>{tCommon('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.studentId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.department || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.profileStatus}</Badge>
                    </TableCell>
                    <TableCell className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" className="text-green-600" onClick={() => { setSelectedItem(item); setDialogType('approve'); }}>
                        <Check className="h-4 w-4 mr-1" />{t('approve')}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => { setSelectedItem(item); setDialogType('reject'); }}>
                        <X className="h-4 w-4 mr-1" />{t('reject')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedItem && dialogType === 'reject'} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('reject')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('rejectReason')}</Label>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={t('enterRejectReason')} />
            </div>
            <Button onClick={handleAction} variant="destructive" className="w-full">{t('reject')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedItem && dialogType === 'approve'} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('approve')}</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">{t('name')}: {selectedItem?.name}</p>
          <Button onClick={handleAction} className="w-full">{t('approve')}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
