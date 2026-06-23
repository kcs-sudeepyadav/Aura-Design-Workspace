const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.project.findMany().then(r => { console.log(r); prisma.$disconnect(); });
