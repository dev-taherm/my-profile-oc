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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, email, password, resumeUrl } = body;

  if (resumeUrl !== undefined) {
    const userId = (session.user as { id: string }).id;
    await prisma.user.update({
      where: { id: userId },
      data: { resumeUrl },
    });
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && existingUser.id !== userId) {
    return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      password: hashedPassword,
      passwordChanged: true,
    },
  });

  return NextResponse.json({ success: true });
}
