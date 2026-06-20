import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const UPLOAD_CONFIG = {
  projects: { dir: "uploads/projects", types: ["image/jpeg", "image/png", "image/webp"] },
  blog: { dir: "uploads/blog", types: ["image/jpeg", "image/png", "image/webp"] },
  resume: { dir: "uploads/resume", types: ["application/pdf"] },
} as const;

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as keyof typeof UPLOAD_CONFIG | null;

  if (!type || !UPLOAD_CONFIG[type]) {
    return NextResponse.json({ error: "Invalid upload type. Use: projects, blog, or resume" }, { status: 400 });
  }

  const config = UPLOAD_CONFIG[type];

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!(config.types as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${config.types.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size: 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");

    const uploadDir = join(process.cwd(), "public", config.dir);
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/${config.dir}/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
