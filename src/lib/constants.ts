export const APP_NAME = '校园智慧助手';

export const ROLES = {
  STUDENT: 'STUDENT',
  ORG_LEADER: 'ORG_LEADER',
  COMMITTEE: 'COMMITTEE',
} as const;

export const PRIORITY_COLORS = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
} as const;

export const TASK_STATUS_COLORS = {
  PENDING_VIEW: 'bg-gray-100 text-gray-700',
  VIEWED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
} as const;

export const SKILL_CATEGORY_COLORS = {
  TECHNICAL: 'bg-blue-500',
  PLANNING: 'bg-purple-500',
  MANAGEMENT: 'bg-green-500',
  SPORTS: 'bg-orange-500',
} as const;
