import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { translations: true, categories: true, tags: true, author: { select: { name: true } } },
    });
    return NextResponse.json(post);
  }

  const posts = await prisma.blogPost.findMany({
    include: { translations: true, categories: true, tags: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { slug, readingTime, featured, status, publishedAt, translations } = body;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      readingTime,
      featured,
      status,
      publishedAt,
      authorId: (session.user as { id: string }).id,
      translations: {
        create: translations.map((t: { locale: string; title: string; excerpt: string; content: string }) => ({
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
        })),
      },
    },
    include: { translations: true },
  });

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json();
  const { slug, readingTime, featured, status, publishedAt, translations } = body;

  await prisma.blogPostTranslation.deleteMany({ where: { blogPostId: id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug,
      readingTime,
      featured,
      status,
      publishedAt,
      translations: {
        create: translations.map((t: { locale: string; title: string; excerpt: string; content: string }) => ({
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
        })),
      },
    },
    include: { translations: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
