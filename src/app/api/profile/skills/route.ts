import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id;

  const userSkills = await prisma.userSkillTag.findMany({
    where: { userId },
    include: { skillTag: true },
    orderBy: { skillTag: { category: 'asc' } },
  });

  const allSkills = await prisma.skillTag.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json({
    userSkills: userSkills.map((us) => ({
      id: us.id,
      name: us.skillTag.name,
      category: us.skillTag.category,
      level: us.level,
    })),
    allSkills: allSkills.map((s) => ({ id: s.id, name: s.name, category: s.category })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const userSkill = await prisma.userSkillTag.create({
      data: { userId: (session.user as any).id, skillTagId: body.skillTagId, level: body.level || 3 },
    });
    return NextResponse.json(userSkill);
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Already added' }, { status: 409 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const updated = await prisma.userSkillTag.update({
    where: { id: body.userSkillTagId },
    data: { level: body.level },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userSkillTagId = req.nextUrl.searchParams.get('userSkillTagId');
  if (!userSkillTagId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  await prisma.userSkillTag.delete({ where: { id: userSkillTagId } });
  return NextResponse.json({ success: true });
}
