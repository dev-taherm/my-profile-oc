import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { mediaIds, folderId } = body;

  if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
    return NextResponse.json({ error: "mediaIds is required" }, { status: 400 });
  }

  if (folderId) {
    const folder = await prisma.mediaFolder.findUnique({ where: { id: folderId } });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
  }

  await prisma.media.updateMany({
    where: { id: { in: mediaIds } },
    data: { folderId: folderId || null },
  });

  return NextResponse.json({ ok: true });
}
