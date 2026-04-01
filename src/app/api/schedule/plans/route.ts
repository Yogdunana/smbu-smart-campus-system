import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const plans = await prisma.plan.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { startTime: 'asc' },
  });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const plan = await prisma.plan.create({
    data: {
      title: body.title,
      description: body.description,
      priority: body.priority || 'MEDIUM',
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      location: body.location,
      userId: (session.user as any).id,
    },
  });
  return NextResponse.json(plan);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const plan = await prisma.plan.update({
    where: { id: body.id, userId: (session.user as any).id },
    data: { status: body.status },
  });
  return NextResponse.json(plan);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  await prisma.plan.delete({ where: { id, userId: (session.user as any).id } });
  return NextResponse.json({ success: true });
}
