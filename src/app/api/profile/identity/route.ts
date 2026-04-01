import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { gender: body.gender, ethnicity: body.ethnicity, idCardNumber: body.idCardNumber, grade: body.grade, department: body.department, major: body.major, className: body.className },
  });
  return NextResponse.json(user);
}
