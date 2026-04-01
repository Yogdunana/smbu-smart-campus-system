import { NextResponse } from 'next/server';

const courses = [
  { id: '1', courseName: '高等数学', teacher: '张教授', location: '教学楼A-301', dayOfWeek: 1, startTime: '08:00', endTime: '09:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#3B82F6' },
  { id: '2', courseName: '大学英语', teacher: '李老师', location: '教学楼B-205', dayOfWeek: 1, startTime: '10:00', endTime: '11:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#10B981' },
  { id: '3', courseName: '线性代数', teacher: '王教授', location: '教学楼A-401', dayOfWeek: 2, startTime: '08:00', endTime: '09:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#8B5CF6' },
  { id: '4', courseName: '程序设计基础', teacher: '赵老师', location: '实验楼C-302', dayOfWeek: 2, startTime: '14:00', endTime: '15:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#F59E0B' },
  { id: '5', courseName: '大学物理', teacher: '刘教授', location: '教学楼A-201', dayOfWeek: 3, startTime: '08:00', endTime: '09:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#EC4899' },
  { id: '6', courseName: '体育', teacher: '陈老师', location: '体育馆', dayOfWeek: 3, startTime: '14:00', endTime: '15:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#14B8A6' },
  { id: '7', courseName: '思想政治理论', teacher: '孙老师', location: '教学楼B-101', dayOfWeek: 4, startTime: '10:00', endTime: '11:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#6366F1' },
  { id: '8', courseName: '数据结构与算法', teacher: '周教授', location: '实验楼C-201', dayOfWeek: 4, startTime: '14:00', endTime: '15:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#EF4444' },
  { id: '9', courseName: '俄语基础', teacher: 'Елена', location: '教学楼A-102', dayOfWeek: 5, startTime: '08:00', endTime: '09:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#0EA5E9' },
  { id: '10', courseName: '离散数学', teacher: '吴教授', location: '教学楼A-301', dayOfWeek: 5, startTime: '10:00', endTime: '11:40', weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], color: '#D946EF' },
];

export async function GET() {
  return NextResponse.json(courses);
}
