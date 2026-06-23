import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const newProject = await prisma.project.create({
    data: {
      name: 'Lakeside Mansion',
      client: { connect: { id: 'c-1' } }, // Assuming c-1 exists
      manager: { connect: { id: 'm-1' } } // Assuming m-1 exists
    }
  });
  console.log('Created project:', newProject);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
