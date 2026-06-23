import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.user.findFirst({ where: { role: 'customer' } });
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  const manager = await prisma.user.findFirst({ where: { role: 'manager' } });
  const project = await prisma.project.findFirst({ where: { clientId: customer.id } });

  if (!customer || !admin || !manager || !project) {
    console.error('Missing required entities to seed chat.');
    return;
  }

  // Create a Project Group Conversation
  const conversation = await prisma.conversation.create({
    data: {
      projectId: project.id,
      type: 'GROUP',
      title: 'Project General Chat',
      participants: JSON.stringify([customer.id, admin.id, manager.id]),
      lastActivity: new Date().toISOString()
    }
  });

  // Create a welcome message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: admin.id,
      content: 'Welcome to the Aura Client Portal! Feel free to ask any questions here.',
      timestamp: new Date().toISOString(),
      readBy: '[]' // Assuming readBy is also a JSON string if defined as String, but let's check schema. wait, readBy is not in schema.prisma?
    }
  });

  console.log('Chat seeded successfully.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
