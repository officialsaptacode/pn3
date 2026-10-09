// Dev seed for the SaptaSMS admin panel (`pnpm db:seed`).
// DEV ONLY — well-known passwords. Never run against production.
import "dotenv/config";
import * as argon from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@saptasms.com" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@saptasms.com",
      userName: "Admin",
      hash: await argon.hash("admin123"),
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@saptasms.com" },
    update: {},
    create: {
      email: "manager@saptasms.com",
      userName: "Manager",
      hash: await argon.hash("manager123"),
      role: "USER",
    },
  });

  const template = await prisma.smsTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Overdue Payment Notice",
      content:
        "Dear {name}, your payment of Rs. {amount} was due on {due_date}. Pay via eSewa to avoid penalty.",
      layaScore: 0.1,
      isApproved: true,
      userId: manager.id,
    },
  });

  await prisma.smsTemplate.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Festival Loan Offer",
      content: "WINNER! Claim your FREE festival loan discount now!!! Limited time!!!",
      layaScore: 0.92,
      isApproved: false,
      userId: manager.id,
    },
  });

  const campaign = await prisma.campaign.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "October Overdue Campaign",
      status: "SENDING",
      templateId: template.id,
      userId: manager.id,
      totalRows: 3,
      processedRows: 3,
      failedRows: 1,
    },
  });

  await prisma.smsJob.deleteMany({ where: { campaignId: campaign.id } });
  await prisma.smsJob.createMany({
    data: [
      {
        campaignId: campaign.id,
        phoneNumber: "+9779841000001",
        payload: { message: "Dear Sita, your payment of Rs. 4500 was due on Oct 30." },
        status: "SENT",
      },
      {
        campaignId: campaign.id,
        phoneNumber: "+9779841000002",
        payload: { message: "Dear Ram, your payment of Rs. 7200 was due on Oct 30." },
        status: "SENT",
      },
      {
        campaignId: campaign.id,
        phoneNumber: "invalid",
        payload: { message: "Dear Hari, your payment of Rs. 1100 was due on Oct 30." },
        status: "FAILED",
        error: "Invalid phone number format",
      },
    ],
  });

  console.log("Seeded admin:", admin.email, "/ manager:", manager.email, "(dev passwords logged below)");
  console.log("  admin@saptasms.com / admin123 (ADMIN)");
  console.log("  manager@saptasms.com / manager123 (USER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
