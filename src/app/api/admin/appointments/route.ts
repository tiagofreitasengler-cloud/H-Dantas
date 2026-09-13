import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
export async function GET(){try{await requireAdmin();const items=await prisma.appointment.findMany({include:{user:true,service:true},orderBy:[{date:"asc"},{time:"asc"}]});return NextResponse.json(items)}catch{return NextResponse.json({error:"Acesso negado"},{status:403})}}
export async function PATCH(req:Request){try{await requireAdmin();const b=await req.json();const id=Number(b.id);const status=b.status;if(!["AGENDADO","CONFIRMADO","CANCELADO","CONCLUIDO"].includes(status))return NextResponse.json({error:"Status inválido"},{status:400});const item=await prisma.appointment.update({where:{id},data:{status}});return NextResponse.json(item)}catch{return NextResponse.json({error:"Não foi possível atualizar"},{status:400})}}
