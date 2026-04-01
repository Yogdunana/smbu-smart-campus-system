import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const awards = await prisma.award.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(awards);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const award = await prisma.award.create({
    data: {
      title: body.title,
      level: body.level,
      awardDate: body.awardDate ? new Date(body.awardDate) : null,
      description: body.description,
      userId: (session.user as any).id,
    },
  });
  return NextResponse.json(award);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  await prisma.award.delete({ where: { id, userId: (session.user as any).id } });
  return NextResponse.json({ success: true });
}
