import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { translations: true, categories: true, tags: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { slug, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

  const project = await prisma.project.create({
    data: {
      slug,
      githubUrl,
      liveUrl,
      featured,
      status,
      translations: {
        create: translations.map((t: { locale: string; title: string; description: string; content?: string }) => ({
          locale: t.locale,
          title: t.title,
          description: t.description,
          content: t.content,
        })),
      },
      categories: categoryIds?.length ? { connect: categoryIds.map((id: string) => ({ id })) } : undefined,
      tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { translations: true, categories: true, tags: true },
  });

  return NextResponse.json(project);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json();
  const { slug, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

  await prisma.projectTranslation.deleteMany({ where: { projectId: id } });

  const project = await prisma.project.update({
    where: { id },
    data: {
      slug,
      githubUrl,
      liveUrl,
      featured,
      status,
      translations: {
        create: translations.map((t: { locale: string; title: string; description: string; content?: string }) => ({
          locale: t.locale,
          title: t.title,
          description: t.description,
          content: t.content,
        })),
      },
      categories: { set: categoryIds?.map((id: string) => ({ id })) || [] },
      tags: { set: tagIds?.map((id: string) => ({ id })) || [] },
    },
    include: { translations: true, categories: true, tags: true },
  });

  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
