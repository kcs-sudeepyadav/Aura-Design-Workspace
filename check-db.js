import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.conversation.findMany().then(console.log).finally(() => prisma.$disconnect());
