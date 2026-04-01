'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function BasicInfoPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    wechat: '',
    github: '',
    weibo: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          wechat: data.wechat || '',
          github: data.github || '',
          weibo: data.weibo || '',
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
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
        <h1 className="text-2xl font-bold tracking-tight">{t('basicInfo')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('name')} <span className="text-red-500">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>{t('studentId')}</Label>
                <Input value={(session?.user as any)?.studentId || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('phone')}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('email')}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('wechat')}</Label>
                <Input value={form.wechat} onChange={(e) => setForm({ ...form, wechat: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('github')}</Label>
                <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('weibo')}</Label>
                <Input value={form.weibo} onChange={(e) => setForm({ ...form, weibo: e.target.value })} />
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
