import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const folders = await prisma.mediaFolder.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { media: true } } },
  });

  return NextResponse.json(folders);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await prisma.mediaFolder.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A folder with this name already exists" }, { status: 400 });
  }

  const folder = await prisma.mediaFolder.create({
    data: { name, slug },
    include: { _count: { select: { media: true } } },
  });

  return NextResponse.json(folder);
}
