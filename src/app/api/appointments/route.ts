import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try { const user = await requireUser(); const items = await prisma.appointment.findMany({ where:{userId:user.id}, include:{service:true}, orderBy:[{date:"asc"},{time:"asc"}] }); return NextResponse.json(items); }
  catch { return NextResponse.json({error:"Não autenticado"},{status:401}); }
}

export async function PATCH(req: Request) {
  try { const user = await requireUser(); const b=await req.json(); const id=Number(b.id); const a=await prisma.appointment.findFirst({where:{id,userId:user.id}}); if(!a) return NextResponse.json({error:'Agendamento não encontrado.'},{status:404}); if(a.status==='CONCLUIDO') return NextResponse.json({error:'Agendamentos concluídos não podem ser cancelados.'},{status:409}); const item=await prisma.appointment.update({where:{id},data:{status:'CANCELADO'}}); return NextResponse.json(item); } catch { return NextResponse.json({error:'Não foi possível cancelar.'},{status:400}); }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser(); const body = await req.json().catch(()=>null); const serviceId=Number(body?.serviceId); const date=body?.date; const time=body?.time;
    if (!serviceId || !date || !time) return NextResponse.json({error:"Serviço, data e horário são obrigatórios."},{status:400});
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({error:"Data ou horário inválidos."},{status:400});
    const today = new Date().toISOString().slice(0,10); if (date < today) return NextResponse.json({error:"Datas passadas não são permitidas."},{status:400});
    const service = await prisma.service.findFirst({where:{id:serviceId,active:true}}); if(!service) return NextResponse.json({error:"Serviço indisponível."},{status:400});
    const [y,m,d] = date.split("-").map(Number); const dow = new Date(Date.UTC(y,m-1,d)).getUTCDay(); const normalized = dow===0?7:dow;
    const allowed = await prisma.availability.findUnique({where:{dayOfWeek_time:{dayOfWeek:normalized,time}},}); const blocked=await prisma.blockedDate.findUnique({where:{date}});
    if (!allowed?.active || blocked) return NextResponse.json({error:"Este horário não está disponível."},{status:409});
    const existing = await prisma.appointment.findUnique({where:{date_time:{date,time}}}).catch(()=>null);
    if(existing && existing.status !== "CANCELADO") return NextResponse.json({error:"Este horário acabou de ser ocupado."},{status:409});
    const appointment = existing ? await prisma.appointment.update({where:{id:existing.id},data:{userId:user.id,serviceId,barberName:"Pedro Henrique Dantas",valueCents:service.priceCents,status:"AGENDADO",createdAt:new Date()}}) : await prisma.appointment.create({data:{userId:user.id,serviceId,barberName:"Pedro Henrique Dantas",date,time,valueCents:service.priceCents}});
    return NextResponse.json({ok:true,id:appointment.id});
  } catch(e:any) {
    if(e?.code === "P2002") return NextResponse.json({error:"Este horário acabou de ser ocupado."},{status:409});
    if(e?.message === "UNAUTHORIZED") return NextResponse.json({error:"Faça login para agendar."},{status:401});
    return NextResponse.json({error:"Não foi possível realizar o agendamento."},{status:500});
  }
}
