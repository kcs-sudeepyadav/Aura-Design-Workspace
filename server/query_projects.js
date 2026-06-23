const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.project.findMany().then(r => { console.log(r); p.$disconnect(); });
