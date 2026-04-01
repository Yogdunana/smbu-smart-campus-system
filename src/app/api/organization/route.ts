import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const orgs = await prisma.organization.findMany({
    include: {
      _count: { select: { leaders: true, tasks: true, departments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orgs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const org = await prisma.organization.create({
    data: {
      fullName: body.fullName,
      shortName: body.shortName,
      nature: body.nature || 'STUDENT_ORG',
      description: body.description,
      teacherAdvisor: body.teacherAdvisor,
    },
  });
  return NextResponse.json(org);
}
