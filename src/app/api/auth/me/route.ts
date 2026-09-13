import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(){try{const u=await requireUser();return NextResponse.json({id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role})}catch{return NextResponse.json({error:'Não autenticado'},{status:401})}}
export async function PATCH(req:Request){try{const u=await requireUser();const b=await req.json();const data:any={};if(typeof b.name==='string'&&b.name.trim())data.name=b.name.trim();if(typeof b.phone==='string'&&b.phone.trim())data.phone=b.phone.trim();if(b.newPassword){if(b.newPassword.length<8)return NextResponse.json({error:'A nova senha precisa ter pelo menos 8 caracteres.'},{status:400});data.passwordHash=await bcrypt.hash(b.newPassword,12)}const updated=await prisma.user.update({where:{id:u.id},data});return NextResponse.json({ok:true,name:updated.name,phone:updated.phone})}catch{return NextResponse.json({error:'Não foi possível atualizar o perfil.'},{status:400})}}
