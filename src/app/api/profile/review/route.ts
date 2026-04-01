import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if ((session.user as any).role !== 'COMMITTEE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const items = await prisma.user.findMany({
    where: { profileStatus: { in: ['PENDING_REVIEW', 'REJECTED'] } },
    select: { id: true, studentId: true, name: true, department: true, profileStatus: true },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if ((session.user as any).role !== 'COMMITTEE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const data: any = {};
  if (body.action === 'approve') {
    data.profileStatus = 'APPROVED';
    data.profileReviewNote = null;
  } else {
    data.profileStatus = 'REJECTED';
    data.profileReviewNote = body.reason || '';
  }

  const user = await prisma.user.update({
    where: { id: body.userId },
    data,
  });
  return NextResponse.json(user);
}
