import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
export async function GET(){try{await requireAdmin();const today=new Date().toISOString().slice(0,10);const [todayCount,nextCount,clients,done]=await Promise.all([prisma.appointment.count({where:{date:today,status:{not:"CANCELADO"}}}),prisma.appointment.count({where:{date:{gte:today},status:{in:["AGENDADO","CONFIRMADO"]}}}),prisma.user.count({where:{role:"CLIENT"}}),prisma.appointment.count({where:{status:"CONCLUIDO"}})]);return NextResponse.json({todayCount,nextCount,clients,done});}catch{return NextResponse.json({error:"Acesso negado"},{status:403})}}
