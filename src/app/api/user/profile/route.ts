import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, resumeUrl: true },
  });

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, password, resumeUrl } = body;

    const userId = (session.user as { id: string }).id;

    if (resumeUrl !== undefined || (body.hasOwnProperty("resumeUrl") && !name)) {
      await prisma.user.update({
        where: { id: userId },
        data: { resumeUrl: resumeUrl ?? null },
      });
      return NextResponse.json({ success: true });
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
    }

    const updateData: { name: string; email: string; password?: string; passwordChanged?: boolean } = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
      updateData.passwordChanged = true;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
