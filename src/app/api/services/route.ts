import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() { return NextResponse.json(await prisma.service.findMany({ where:{active:true}, orderBy:{id:"asc"} })); }
