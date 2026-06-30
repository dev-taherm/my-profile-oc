import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.socialAccount.findFirst({
    where: { provider: "telegram" },
    select: {
      id: true,
      provider: true,
      providerAccountId: true,
      name: true,
      isActive: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });

  if (!account) {
    return NextResponse.json({ account: null });
  }

  return NextResponse.json({
    account: {
      ...account,
      chatId: account.providerAccountId,
      postCount: account._count.posts,
      _count: undefined,
    },
  });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.socialAccount.findFirst({
    where: { provider: "telegram" },
  });

  if (!account) {
    return NextResponse.json({ error: "Not configured" }, { status: 404 });
  }

  await prisma.socialAccount.delete({ where: { id: account.id } });

  return NextResponse.json({ success: true });
}
