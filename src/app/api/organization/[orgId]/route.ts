import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      leaders: { include: { user: { select: { name: true, studentId: true } } } },
      departments: { select: { id: true, name: true } },
      tasks: { orderBy: { createdAt: 'desc' } },
    },
  });
  return NextResponse.json(org);
}
