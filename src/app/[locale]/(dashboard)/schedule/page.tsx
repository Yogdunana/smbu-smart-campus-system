'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Clock, MapPin, BookOpen, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { zhCN, enUS, ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

interface CourseItem {
  id: string;
  courseName: string;
  teacher: string;
  location: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  weeks: number[];
  color: string;
}

interface PlanItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  startTime: string;
  endTime: string;
  location: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'border-l-slate-400',
  MEDIUM: 'border-l-blue-500',
  HIGH: 'border-l-orange-500',
  URGENT: 'border-l-red-500',
};

const COURSE_COLORS = [
  'bg-blue-50 border-blue-200 text-blue-800',
  'bg-green-50 border-green-200 text-green-800',
  'bg-purple-50 border-purple-200 text-purple-800',
  'bg-orange-50 border-orange-200 text-orange-800',
  'bg-pink-50 border-pink-200 text-pink-800',
  'bg-teal-50 border-teal-200 text-teal-800',
];

export default function SchedulePage() {
  const t = useTranslations('schedule');
  const tPriority = useTranslations('priority');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [view, setView] = useState('week');
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ title: '', description: '', priority: 'MEDIUM', startTime: '', endTime: '', location: '' });

  const fetchCourses = async () => {
    const res = await fetch('/api/mock/course-schedule');
    if (res.ok) setCourses(await res.json());
  };

  const fetchPlans = async () => {
    const res = await fetch('/api/schedule/plans');
    if (res.ok) setPlans(await res.json());
  };

  useEffect(() => {
    fetchCourses();
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/schedule/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      });
      if (res.ok) {
        toast.success(t('planCreated'));
        setDialogOpen(false);
        setPlanForm({ title: '', description: '', priority: 'MEDIUM', startTime: '', endTime: '', location: '' });
        fetchPlans();
      }
    } catch { toast.error(tCommon('error')); }
  };

  const handleTogglePlan = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await fetch('/api/schedule/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchPlans();
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

  const getCoursesForDay = (dayIndex: number) => {
    const currentWeek = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return courses.filter(c => c.dayOfWeek === dayIndex && c.weeks.includes(currentWeek));
  };

  const getPlansForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return plans.filter(p => p.startTime.startsWith(dateStr));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addWeeks(currentDate, -1))}>←</Button>
          <span className="text-sm font-medium">{t('week', { week: 1 })}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>→</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button><Plus className="mr-2 h-4 w-4" />{t('addPlan')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('addPlan')}</DialogTitle></DialogHeader>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('planTitle')} <span className="text-red-500">*</span></Label>
                  <Input value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('planDescription')}</Label>
                  <Input value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('startTime')}</Label>
                    <Input type="datetime-local" value={planForm.startTime} onChange={(e) => setPlanForm({ ...planForm, startTime: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('endTime')}</Label>
                    <Input type="datetime-local" value={planForm.endTime} onChange={(e) => setPlanForm({ ...planForm, endTime: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('location')}</Label>
                    <Input value={planForm.location} onChange={(e) => setPlanForm({ ...planForm, location: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{tCommon('priority')}</Label>
                    <Select value={planForm.priority} onValueChange={(v) => setPlanForm({ ...planForm, priority: v || 'MEDIUM' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">{tPriority('low')}</SelectItem>
                        <SelectItem value="MEDIUM">{tPriority('medium')}</SelectItem>
                        <SelectItem value="HIGH">{tPriority('high')}</SelectItem>
                        <SelectItem value="URGENT">{tPriority('urgent')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">{tCommon('submit')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="day">{t('dayView')}</TabsTrigger>
          <TabsTrigger value="week">{t('weekView')}</TabsTrigger>
          <TabsTrigger value="month">{t('monthView')}</TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
                    <div className="p-2 text-xs text-muted-foreground"></div>
                    {weekDays.map((day, i) => (
                      <div key={i} className={`p-2 text-center text-sm font-medium border-l ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-50 text-blue-700' : ''}`}>
                        <div>{dayNames[i]}</div>
                        <div className="text-xs text-muted-foreground">{format(day, 'MM/dd')}</div>
                      </div>
                    ))}
                  </div>
                  {/* Time slots */}
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b min-h-[48px]">
                      <div className="p-1 text-xs text-muted-foreground text-right pr-2">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      {weekDays.map((day, dayIdx) => {
                        const dayCourses = getCoursesForDay(dayIdx + 1).filter(c => {
                          const startH = parseInt(c.startTime.split(':')[0]);
                          return startH === hour;
                        });
                        const dayPlans = getPlansForDate(day).filter(p => {
                          const planHour = parseInt(p.startTime.split('T')[1]?.split(':')[0] || '0');
                          return planHour === hour;
                        });
                        return (
                          <div key={dayIdx} className={`border-l p-0.5 ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-50/30' : ''}`}>
                            {dayCourses.map((course, ci) => (
                              <div key={ci} className={`rounded text-xs p-1 mb-0.5 ${COURSE_COLORS[ci % COURSE_COLORS.length]} border`}>
                                <div className="font-medium truncate">{course.courseName}</div>
                                <div className="text-[10px] opacity-75">{course.location}</div>
                              </div>
                            ))}
                            {dayPlans.map((plan) => (
                              <div key={plan.id} className={`rounded text-xs p-1 mb-0.5 border-l-2 bg-white border ${PRIORITY_COLORS[plan.priority] || ''}`}>
                                <div className="font-medium truncate">{plan.title}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{format(currentDate, 'yyyy年MM月dd日 EEEE')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getCoursesForDay(currentDate.getDay() === 0 ? 7 : currentDate.getDay()).length === 0 && getPlansForDate(currentDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t('noPlans')}</div>
              ) : (
                <>
                  {getCoursesForDay(currentDate.getDay() === 0 ? 7 : currentDate.getDay()).map((course, i) => (
                    <div key={i} className={`rounded-lg p-3 border ${COURSE_COLORS[i % COURSE_COLORS.length]}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{course.courseName}</div>
                        <Badge variant="outline" className="text-xs">{course.startTime}-{course.endTime}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm opacity-75">
                        <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.teacher}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{course.location}</span>
                      </div>
                    </div>
                  ))}
                  {getPlansForDate(currentDate).map((plan) => (
                    <div key={plan.id} className={`rounded-lg p-3 border-l-4 bg-white border ${PRIORITY_COLORS[plan.priority] || ''} flex items-center justify-between`}>
                      <div>
                        <div className={`font-medium ${plan.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>{plan.title}</div>
                        {plan.location && <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3.5 w-3.5" />{plan.location}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{plan.startTime.split('T')[1]?.slice(0, 5)}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleTogglePlan(plan.id, plan.status)}>
                          <CheckCircle2 className={`h-4 w-4 ${plan.status === 'COMPLETED' ? 'text-green-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{format(currentDate, 'yyyy年MM月')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map(d => <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">{d}</div>)}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const dayPlans = getPlansForDate(day);
                  const dayCourses = getCoursesForDay(day.getDay() === 0 ? 7 : day.getDay());
                  const hasEvents = dayPlans.length > 0 || dayCourses.length > 0;
                  return (
                    <div key={i} className={`min-h-[60px] p-1 rounded border text-xs ${isCurrentMonth ? '' : 'opacity-30'} ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className={`font-medium ${isToday ? 'text-blue-700' : 'text-muted-foreground'}`}>{format(day, 'd')}</div>
                      {hasEvents && <div className="flex gap-0.5 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /></div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
