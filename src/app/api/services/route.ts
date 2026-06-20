import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    include: { translations: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slug, icon, featured, status, order, translations } = body;

    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    if (!translations?.length) return NextResponse.json({ error: "At least one translation is required" }, { status: 400 });

    const service = await prisma.service.create({
      data: {
        slug,
        icon,
        featured,
        status,
        order,
        translations: {
          create: translations.map((t: { locale: string; title: string; shortDesc: string; description: string; features?: string }) => ({
            locale: t.locale,
            title: t.title,
            shortDesc: t.shortDesc,
            description: t.description,
            features: t.features,
          })),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
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
    const { slug, icon, featured, status, order, translations } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        slug,
        icon,
        featured,
        status,
        order,
        translations: {
          deleteMany: {},
          create: translations.map((t: { locale: string; title: string; shortDesc: string; description: string; features?: string }) => ({
            locale: t.locale,
            title: t.title,
            shortDesc: t.shortDesc,
            description: t.description,
            features: t.features,
          })),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("PUT /api/services error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/services error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
