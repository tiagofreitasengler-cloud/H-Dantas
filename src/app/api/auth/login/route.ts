import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
export async function POST(req: Request) {
  const body = await req.json().catch(() => null); const email = body?.email?.trim().toLowerCase(); const password = body?.password;
  if (!email || !password) return NextResponse.json({ error: "Preencha e-mail e senha." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "E-mail inexistente." }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  await createSession(user.id, user.role);
  return NextResponse.json({ role: user.role });
}
