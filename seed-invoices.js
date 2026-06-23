import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  let customer = await prisma.user.findFirst({ where: { email: 'client@aura.com' } });
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        email: 'client@aura.com',
        password: hashedPassword,
        name: 'Ananya Mehta',
        role: 'customer'
      }
    });
  }

  let project = await prisma.project.findFirst({ where: { clientId: customer.id } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'The Penthouse Residency',
        phase: 'Execution',
        health: 'green',
        budget: '₹28,20,000',
        completion: 40,
        startDate: 'Jan 2025',
        endDate: 'Nov 2025',
        clientId: customer.id
      }
    });
  }

  const initialInvoices = [{
    id: 'inv-1',
    label: 'Design Retainer',
    amount: '₹3,50,000',
    status: 'paid',
    due: 'Jan 10',
    ref: 'AUR-2025-001'
  }, {
    id: 'inv-2',
    label: 'Concept & Design Development',
    amount: '₹4,20,000',
    status: 'paid',
    due: 'Feb 15',
    ref: 'AUR-2025-002'
  }, {
    id: 'inv-3',
    label: 'Material Procurement Deposit',
    amount: '₹8,00,000',
    status: 'paid',
    due: 'Mar 01',
    ref: 'AUR-2025-003'
  }];

  for (const inv of initialInvoices) {
    const exists = await prisma.invoice.findFirst({ where: { ref: inv.ref }});
    if (!exists) {
      await prisma.invoice.create({
        data: {
          ref: inv.ref,
          amount: inv.amount,
          status: inv.status,
          date: inv.due,
          clientId: customer.id,
          projectId: project.id
        }
      });
    }
  }
  console.log('Invoices seeded successfully for Ananya Mehta.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
