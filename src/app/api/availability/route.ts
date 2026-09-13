import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error:"Data inválida." }, {status:400});
  if (date < new Date().toISOString().slice(0,10)) return NextResponse.json({ slots:[] });
  const [y,m,d] = date.split("-").map(Number); const dow = new Date(Date.UTC(y,m-1,d)).getUTCDay(); const normalized = dow === 0 ? 7 : dow;
  const blocked = await prisma.blockedDate.findUnique({ where:{date} }); if (blocked) return NextResponse.json({ slots:[] });
  const base = await prisma.availability.findMany({ where:{dayOfWeek:normalized,active:true}, orderBy:{time:"asc"} });
  const taken = await prisma.appointment.findMany({ where:{date,status:{not:"CANCELADO"}}, select:{time:true} });
  const used = new Set(taken.map(a=>a.time)); return NextResponse.json({ slots:base.filter(s=>!used.has(s.time)).map(s=>s.time) });
}
