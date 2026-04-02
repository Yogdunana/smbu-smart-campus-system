'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X, Star } from 'lucide-react';

const CATEGORIES = ['TECHNICAL', 'PLANNING', 'MANAGEMENT', 'SPORTS'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  TECHNICAL: 'bg-blue-100 text-blue-700 border-blue-200',
  PLANNING: 'bg-purple-100 text-purple-700 border-purple-200',
  MANAGEMENT: 'bg-green-100 text-green-700 border-green-200',
  SPORTS: 'bg-orange-100 text-orange-700 border-orange-200',
};

interface SkillTag {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface AllSkill {
  id: string;
  name: string;
  category: string;
}

export default function SkillsPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [userSkills, setUserSkills] = useState<SkillTag[]>([]);
  const [allSkills, setAllSkills] = useState<AllSkill[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('TECHNICAL');
  const [newSkillId, setNewSkillId] = useState('');

  const fetchSkills = async () => {
    const res = await fetch('/api/profile/skills');
    if (res.ok) {
      const data = await res.json();
      setUserSkills(data.userSkills || []);
      setAllSkills(data.allSkills || []);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkillId) return;
    try {
      const res = await fetch('/api/profile/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillTagId: newSkillId, level: 3 }),
      });
      if (res.ok) {
        toast.success(t('addSkill') + ' ✓');
        setDialogOpen(false);
        setNewSkillId('');
        fetchSkills();
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    }
  };

  const handleRemoveSkill = async (userSkillTagId: string) => {
    try {
      const res = await fetch(`/api/profile/skills?userSkillTagId=${userSkillTagId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success(t('removeSkill') + ' ✓');
        fetchSkills();
      } else {
        toast.error(tCommon('error'));
      }
    } catch {
      toast.error(tCommon('error'));
    }
  };

  const handleLevelChange = async (userSkillTagId: string, level: number) => {
    try {
      const res = await fetch('/api/profile/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkillTagId, level }),
      });
      if (res.ok) {
        fetchSkills();
      }
    } catch {
      // silent
    }
  };

  const categoryKey = (cat: string) => cat.toLowerCase() as 'technical' | 'planning' | 'management' | 'sports';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('skillTags')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('addSkill')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addSkill')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('skillCategory.' + categoryKey(selectedCategory))}</Label>
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v || 'TECHNICAL'); setNewSkillId(''); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t('skillCategory.' + categoryKey(cat))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('skillTags')}</Label>
                <Select value={newSkillId} onValueChange={(v) => setNewSkillId(v || '')}>
                  <SelectTrigger><SelectValue placeholder={t('addSkill')} /></SelectTrigger>
                  <SelectContent>
                    {allSkills
                      .filter((s) => s.category === selectedCategory)
                      .filter((s) => !userSkills.some((us) => us.id === s.id))
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddSkill} className="w-full" disabled={!newSkillId}>
                {t('addSkill')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="TECHNICAL">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {t('skillCategory.' + categoryKey(cat))}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((cat) => {
          const skills = userSkills.filter((s) => s.category === cat);
          return (
            <TabsContent key={cat} value={cat}>
              <Card>
                <CardContent className="pt-6">
                  {skills.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">{t('noSkills')}</div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill) => (
                        <div key={skill.id} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${CATEGORY_COLORS[cat] || ''}`}>
                          <span className="font-medium">{skill.name}</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <Star
                                key={level}
                                className={`h-3.5 w-3.5 cursor-pointer ${level <= skill.level ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                                onClick={() => handleLevelChange(skill.id, level)}
                              />
                            ))}
                          </div>
                          <button onClick={() => handleRemoveSkill(skill.id)} className="ml-1 hover:text-red-500">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
