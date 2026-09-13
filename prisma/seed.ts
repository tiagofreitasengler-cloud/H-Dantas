import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hdantas.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "HDAntas@2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Pedro Henrique Dantas", phone: "+55 16 99178-1025", passwordHash, role: Role.ADMIN },
    create: { name: "Pedro Henrique Dantas", email: adminEmail, phone: "+55 16 99178-1025", passwordHash, role: Role.ADMIN }
  });

  const services = [
    { name: "Corte de cabelo", description: "Corte de cabelo masculino", priceCents: 3500, durationMin: 30 },
    { name: "Barba", description: "Barba com acabamento", priceCents: 1000, durationMin: 20 },
    { name: "Corte + Barba", description: "Corte de cabelo + barba", priceCents: 4500, durationMin: 50 }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: service,
      create: service
    });
  }

  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  for (let day = 1; day <= 6; day++) {
    for (const time of times) {
      await prisma.availability.upsert({ where: { dayOfWeek_time: { dayOfWeek: day, time } }, update: { active: true }, create: { dayOfWeek: day, time } });
    }
  }

  console.log(`Admin: ${adminEmail}`);
  console.log(`Senha inicial: ${adminPassword}`);
}

main().finally(() => prisma.$disconnect());
