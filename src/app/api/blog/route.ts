import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pingIndexNow } from "@/app/api/indexnow/route";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { translations: true, categories: true, tags: true, author: { select: { name: true, email: true } } },
    });
    return NextResponse.json(post);
  }

  const posts = await prisma.blogPost.findMany({
    include: { translations: true, categories: true, tags: true, author: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slug, coverImage, readingTime, featured, status, publishedAt, translations, categoryIds, tagIds } = body;

    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    if (!translations?.length) return NextResponse.json({ error: "At least one translation is required" }, { status: 400 });

    const userId = (session.user as { id: string }).id;
    const authorExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });

    const post = await prisma.blogPost.create({
      data: {
        slug,
        coverImage,
        readingTime,
        featured,
        status,
        publishedAt,
        authorId: authorExists ? userId : null,
        translations: {
          create: translations.map((t: { locale: string; title: string; excerpt: string; content: string }) => ({
            locale: t.locale,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
          })),
        },
        categories: categoryIds?.length ? { connect: categoryIds.map((id: string) => ({ id })) } : undefined,
        tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
      include: { translations: true, categories: true, tags: true },
    });

    if (status === "PUBLISHED") {
      pingIndexNow([
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/en/blog/${slug}`,
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/ar/blog/${slug}`,
      ]);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
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
    const { slug, coverImage, readingTime, featured, status, publishedAt, translations, categoryIds, tagIds } = body;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        slug,
        coverImage,
        readingTime,
        featured,
        status,
        publishedAt,
        translations: {
          deleteMany: {},
          create: translations.map((t: { locale: string; title: string; excerpt: string; content: string }) => ({
            locale: t.locale,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
          })),
        },
        categories: { set: categoryIds?.map((id: string) => ({ id })) || [] },
        tags: { set: tagIds?.map((id: string) => ({ id })) || [] },
      },
      include: { translations: true, categories: true, tags: true },
    });

    if (status === "PUBLISHED") {
      pingIndexNow([
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/en/blog/${slug}`,
        `${process.env.NEXTAUTH_URL || "https://taher.pixovagency.com"}/ar/blog/${slug}`,
      ]);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT /api/blog error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
