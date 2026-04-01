import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, studentId: true, name: true, email: true, phone: true, wechat: true, github: true, weibo: true, gender: true, ethnicity: true, idCardNumber: true, photoUrl: true, grade: true, department: true, major: true, className: true, volunteerNumber: true, profileStatus: true, role: true },
  });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name: body.name, email: body.email, phone: body.phone, wechat: body.wechat, github: body.github, weibo: body.weibo },
  });
  return NextResponse.json(user);
}
