'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function IdentityPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    gender: '',
    ethnicity: '',
    idCardNumber: '',
    grade: '',
    department: '',
    major: '',
    className: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setForm({
          gender: data.gender || '',
          ethnicity: data.ethnicity || '',
          idCardNumber: data.idCardNumber || '',
          grade: data.grade || '',
          department: data.department || '',
          major: data.major || '',
          className: data.className || '',
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile/identity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(t('infoSaved'));
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
        <h1 className="text-2xl font-bold tracking-tight">{t('identityInfo')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('identityInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('gender')}</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v || '' })}>
                  <SelectTrigger><SelectValue placeholder={t('gender')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">{t('male')}</SelectItem>
                    <SelectItem value="FEMALE">{t('female')}</SelectItem>
                    <SelectItem value="OTHER">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('ethnicity')}</Label>
                <Input value={form.ethnicity} onChange={(e) => setForm({ ...form, ethnicity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('idCard')}</Label>
                <Input value={form.idCardNumber} onChange={(e) => setForm({ ...form, idCardNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('grade')}</Label>
                <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="2023" />
              </div>
              <div className="space-y-2">
                <Label>{t('department')}</Label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('major')}</Label>
                <Input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('className')}</Label>
                <Input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {tCommon('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
