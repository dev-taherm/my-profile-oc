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
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slug, image, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    if (!translations?.length) return NextResponse.json({ error: "At least one translation is required" }, { status: 400 });

    const project = await prisma.project.create({
      data: {
        slug,
        image,
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
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await request.json();
    const { slug, image, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        slug,
        image,
        githubUrl,
        liveUrl,
        featured,
        status,
        translations: {
          deleteMany: {},
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
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
