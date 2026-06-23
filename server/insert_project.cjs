const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let client = users.find(u => u.role === 'client');
  let manager = users.find(u => u.role === 'manager');
  
  if (!client) client = users[0];
  if (!manager) manager = users[0];

  const newProject = await prisma.project.create({
    data: {
      name: 'Lakeside Mansion',
      client: { connect: { id: client.id } },
      manager: { connect: { id: manager.id } },
      phase: 'Handover',
      health: 'green',
      budget: '₹8.5 Cr',
      completion: 95,
      startDate: 'Jan 10, 2025',
      endDate: 'Jun 15, 2026'
    }
  });
  console.log('Created project in Prisma DB:', newProject.name);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
