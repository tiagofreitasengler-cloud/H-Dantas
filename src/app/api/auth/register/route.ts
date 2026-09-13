import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = body?.name?.trim(); const email = body?.email?.trim().toLowerCase(); const phone = body?.phone?.trim(); const password = body?.password; const confirm = body?.confirmPassword;
  if (!name || !email || !phone || !password || !confirm) return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  if (password !== confirm) return NextResponse.json({ error: "As senhas não coincidem." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres." }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, phone, passwordHash } });
  await createSession(user.id, user.role);
  return NextResponse.json({ ok: true });
}
