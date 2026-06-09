import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { resumeUrl: true },
    });

    return NextResponse.json({ resumeUrl: user?.resumeUrl || null });
  } catch {
    return NextResponse.json({ resumeUrl: null });
  }
}
