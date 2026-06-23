import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'ananya@email.com', password: 'client123', role: 'client', name: 'Ananya' },
    { email: 'suresh@auradesign.studio', password: 'manager123', role: 'manager', name: 'Suresh' },
    { email: 'admin@auradesign.studio', password: 'admin123', role: 'admin', name: 'Admin' }
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await prisma.user.create({
        data: {
          email: u.email,
          password: hashedPassword,
          role: u.role,
          name: u.name
        }
      });
      console.log(`Created user ${u.email}`);
    } else {
      console.log(`User ${u.email} already exists`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
