import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { volunteerNumber: true },
  });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let records: any[] = [];
  let totalHours = 0;

  if (user.volunteerNumber) {
    records = await prisma.volunteerRecord.findMany({
      where: { volunteerNumber: user.volunteerNumber },
      orderBy: { activityDate: 'desc' },
    });
    totalHours = records.reduce((sum, r) => sum + Number(r.hours), 0);
  }

  return NextResponse.json({ volunteerNumber: user.volunteerNumber, records, totalHours });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const newVolunteerNumber = body.volunteerNumber || null;

  // If unbinding, clear existing associations
  if (!newVolunteerNumber) {
    await prisma.volunteerRecord.updateMany({
      where: { userId: (session.user as any).id },
      data: { userId: null },
    });
  }

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { volunteerNumber: newVolunteerNumber },
  });

  // If binding, associate matching records
  if (newVolunteerNumber) {
    await prisma.volunteerRecord.updateMany({
      where: { volunteerNumber: newVolunteerNumber, userId: null },
      data: { userId: (session.user as any).id },
    });
  }

  return NextResponse.json({ success: true, volunteerNumber: user.volunteerNumber });
}
