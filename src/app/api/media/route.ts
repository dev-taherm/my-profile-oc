import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const MAX_SIZE = 5 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const mimeType = searchParams.get("mimeType") || "";
  const folderId = searchParams.get("folderId");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { filename: { contains: search } },
      { alt: { contains: search } },
    ];
  }
  if (mimeType) {
    where.mimeType = { contains: mimeType };
  }
  if (folderId === "null") {
    where.folderId = null;
  } else if (folderId) {
    where.folderId = folderId;
  }

  const media = await prisma.media.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { folder: { select: { id: true, name: true } } },
  });

  return NextResponse.json(media);
}

type UploadResult = { error: string } | { media: { id: string; url: string; filename: string; mimeType: string; size: number; alt: string | null; folderId: string | null; folder: { id: string; name: string } | null; createdAt: Date } };

async function uploadFile(file: File, folderId: string | null): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: `Invalid file type: ${file.name}. Allowed: ${ALLOWED_TYPES.join(", ")}` };
  }
  if (file.size > MAX_SIZE) {
    return { error: `File too large: ${file.name}. Maximum size: 5MB` };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");

  const uploadDir = join(process.cwd(), "public", "uploads", "media");
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const url = `/uploads/media/${filename}`;

  const media = await prisma.media.create({
    data: {
      filename,
      url,
      mimeType: file.type,
      size: file.size,
      alt: null,
      folderId: folderId || null,
    },
    include: { folder: { select: { id: true, name: true } } },
  });

  return { media };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folderId = (formData.get("folderId") as string) || null;

    if (!files || files.length === 0) {
      const file = formData.get("file") as File | null;
      if (file) {
        files.push(file);
      } else {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }
    }

    const results = await Promise.all(files.map((f) => uploadFile(f, folderId)));
    const errors: string[] = [];
    const uploaded: UploadResult[] = [];

    for (const r of results) {
      if ("error" in r) errors.push(r.error);
      else uploaded.push(r);
    }

    return NextResponse.json({
      media: uploaded.map((r) => ("media" in r ? r.media : null)).filter(Boolean),
      errors,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const ids = searchParams.get("ids");

  const { unlink } = await import("fs/promises");
  const { join } = await import("path");

  const deleteOne = async (mediaId: string) => {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) return;
    try {
      const filePath = join(process.cwd(), "public", media.url);
      await unlink(filePath);
    } catch {
      // file may already be gone
    }
    await prisma.media.delete({ where: { id: mediaId } });
  };

  if (ids) {
    const idList = ids.split(",").filter(Boolean);
    await Promise.all(idList.map(deleteOne));
    return NextResponse.json({ ok: true });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), "public", media.url);
    await unlink(filePath);
  } catch {
    // file may already be gone
  }

  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
