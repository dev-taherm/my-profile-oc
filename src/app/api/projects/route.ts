import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pingIndexNow } from "@/app/api/indexnow/route";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { translations: true, categories: true, tags: true, projectImages: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slug, images, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    if (!translations?.length) return NextResponse.json({ error: "At least one translation is required" }, { status: 400 });

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
        projectImages: images?.length
          ? { create: images.map((img: { url: string }, i: number) => ({ url: img.url, order: i })) }
          : undefined,
        categories: categoryIds?.length ? { connect: categoryIds.map((id: string) => ({ id })) } : undefined,
        tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
      include: { translations: true, categories: true, tags: true, projectImages: { orderBy: { order: "asc" } } },
    });

    if (status === "PUBLISHED") {
      pingIndexNow([
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/en/projects/${slug}`,
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/ar/projects/${slug}`,
      ]);
    }

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
    const { slug, images, githubUrl, liveUrl, featured, status, translations, categoryIds, tagIds } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        slug,
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
        projectImages: {
          deleteMany: {},
          create: images?.map((img: { url: string }, i: number) => ({ url: img.url, order: i })) || [],
        },
        categories: { set: categoryIds?.map((id: string) => ({ id })) || [] },
        tags: { set: tagIds?.map((id: string) => ({ id })) || [] },
      },
      include: { translations: true, categories: true, tags: true, projectImages: { orderBy: { order: "asc" } } },
    });

    if (status === "PUBLISHED") {
      pingIndexNow([
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/en/projects/${slug}`,
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/ar/projects/${slug}`,
      ]);
    }

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
