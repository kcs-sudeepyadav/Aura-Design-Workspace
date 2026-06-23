const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  
  // Update admin
  await prisma.user.update({
    where: { id: 'c47822ec-6ece-4fea-af59-b899699d51dd' },
    data: { password: hash }
  });
  console.log('Admin updated');

  // Update manager to priya@example.com
  await prisma.user.update({
    where: { id: '79ed0289-be3d-42d4-9cdf-15aa514d408e' },
    data: { email: 'priya@example.com', password: hash, name: 'Priya Sharma', avatar: 'PS' }
  });
  console.log('Manager updated');

  // Update customer 1 to ananya@example.com
  await prisma.user.update({
    where: { id: '80b0b930-ecea-454e-8842-5cee5a917988' },
    data: { email: 'ananya@example.com', password: hash }
  });
  console.log('Customer 1 updated');

  console.log('All DB users updated to use password123 and original emails.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
