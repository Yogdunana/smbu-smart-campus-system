'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Heart, Link2, Unlink, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface VolunteerRecord {
  id: string;
  activityName: string;
  activityDate: string;
  hours: number;
  status: string;
}

export default function VolunteerPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [volunteerNumber, setVolunteerNumber] = useState('');
  const [records, setRecords] = useState<VolunteerRecord[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isBound, setIsBound] = useState(false);

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    const res = await fetch('/api/profile/volunteer');
    if (res.ok) {
      const data = await res.json();
      setVolunteerNumber(data.volunteerNumber || '');
      setIsBound(!!data.volunteerNumber);
      setRecords(data.records || []);
      setTotalHours(data.totalHours || 0);
    }
  };

  const handleBind = async () => {
    if (!volunteerNumber.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/profile/volunteer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerNumber: volunteerNumber.trim() }),
      });
      if (res.ok) {
        toast.success(t('volunteerBound'));
        fetchVolunteerData();
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnbind = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile/volunteer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerNumber: '' }),
      });
      if (res.ok) {
        toast.success(t('unbindVolunteer'));
        setRecords([]);
        setTotalHours(0);
        setIsBound(false);
        setVolunteerNumber('');
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('volunteerLink')}</h1>
      </div>

      {/* Volunteer number binding card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {t('bindVolunteer')}
          </CardTitle>
          <CardDescription>
            {isBound ? t('volunteerBound') : t('volunteerNotBound')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label>{t('volunteerNumber')}</Label>
              <Input
                value={volunteerNumber}
                onChange={(e) => setVolunteerNumber(e.target.value)}
                placeholder="V20230001"
                disabled={isBound}
              />
            </div>
            {!isBound ? (
              <Button onClick={handleBind} disabled={loading || !volunteerNumber.trim()}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                {t('bindVolunteer')}
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleUnbind} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlink className="mr-2 h-4 w-4" />}
                {t('unbindVolunteer')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total volunteer hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            {t('totalVolunteerHours')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600">
            {totalHours.toFixed(1)} <span className="text-lg font-normal text-muted-foreground">小时</span>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer records list */}
      <Card>
        <CardHeader>
          <CardTitle>{t('volunteerActivities')}</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t('noVolunteerRecords')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('awardTitle')}</TableHead>
                  <TableHead>{t('awardDate')}</TableHead>
                  <TableHead>{t('volunteerHours')}</TableHead>
                  <TableHead>{tCommon('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.activityName}</TableCell>
                    <TableCell>{format(new Date(record.activityDate), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>{record.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
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
