import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let ananya = users.find(u => u.name === 'Ananya Mehta');
  let rohan = users.find(u => u.name === 'Rohan Desai');

  const hashedPassword = await bcrypt.hash('manager123', 10);
  let sarah = await prisma.user.findUnique({ where: { email: 'sarah@auradesign.studio' } });
  if (!sarah) {
    sarah = await prisma.user.create({
      data: {
        id: 'm-1', // Ensure it matches the fallback
        email: 'sarah@auradesign.studio',
        password: hashedPassword,
        role: 'manager',
        name: 'Sarah Jenkins'
      }
    });
  }

  const initialProjects = [{
    id: 'p-1',
    name: 'The Penthouse Residency',
    clientId: ananya?.id,
    phase: 'Execution',
    health: 'green',
    budget: '₹12.8 Cr',
    completion: 58,
    startDate: 'Jan 10, 2026',
    endDate: 'Jul 30, 2026',
    managerId: sarah.id
  }, {
    id: 'p-2',
    name: 'Meridian Office Tower',
    clientId: rohan?.id,
    phase: 'Design Dev',
    health: 'amber',
    budget: '₹16.5 Cr',
    completion: 35,
    startDate: 'Feb 1, 2026',
    endDate: 'Dec 31, 2026',
    managerId: sarah.id
  }];

  const initialTasks = [{
    id: 't-1',
    label: 'Flooring inspection – Level 3 master bedroom',
    done: true,
    assignee: 'Sarah J.',
    due: 'May 16',
    projectId: 'p-1'
  }, {
    id: 't-2',
    label: 'Electrical first-fix completion sign-off',
    done: true,
    assignee: 'Sarah J.',
    due: 'May 15',
    projectId: 'p-1'
  }, {
    id: 't-3',
    label: 'Upload site photos – Week 13',
    done: false,
    assignee: 'Raj V.',
    due: 'May 17',
    projectId: 'p-2'
  }];

  const initialIssues = [{
    id: 'iss-1',
    title: 'HVAC ducting clash with false ceiling layout in living room',
    priority: 'high',
    status: 'open',
    date: 'May 10',
    assignee: 'Arjun K.',
    projectId: 'p-1'
  }, {
    id: 'iss-2',
    title: 'Delay in Italian marble shipment from supplier',
    priority: 'medium',
    status: 'in-progress',
    date: 'May 8',
    assignee: 'Sarah J.',
    projectId: 'p-2'
  }];
  
  const initialDocuments = [{
    id: 'd-1',
    name: 'Master Bedroom Elevation.pdf',
    type: 'DWG',
    date: 'May 10, 2026',
    size: '4.2 MB',
    projectId: 'p-1'
  }, {
    id: 'd-2',
    name: 'Lighting Schedule Rev 2.xlsx',
    type: 'XLS',
    date: 'May 9, 2026',
    size: '1.1 MB',
    projectId: 'p-2'
  }];

  for (const p of initialProjects) {
    const existing = await prisma.project.findUnique({ where: { id: p.id } });
    if (!existing) {
      await prisma.project.create({ data: p });
    } else {
      await prisma.project.update({ where: { id: p.id }, data: p });
    }
  }

  for (const t of initialTasks) {
    const existing = await prisma.task.findUnique({ where: { id: t.id } });
    if (!existing) {
      await prisma.task.create({ data: t });
    } else {
      await prisma.task.update({ where: { id: t.id }, data: t });
    }
  }

  for (const i of initialIssues) {
    const existing = await prisma.issue.findUnique({ where: { id: i.id } });
    if (!existing) {
      await prisma.issue.create({ data: i });
    } else {
      await prisma.issue.update({ where: { id: i.id }, data: i });
    }
  }
  
  for (const d of initialDocuments) {
    const existing = await prisma.document.findUnique({ where: { id: d.id } });
    if (!existing) {
      await prisma.document.create({ data: d });
    } else {
      await prisma.document.update({ where: { id: d.id }, data: d });
    }
  }

  console.log('Seeded successfully with Sarah Jenkins!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
