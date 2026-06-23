import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function cleanDB() {
  console.log('Cleaning database...');
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.siteLog.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.task.deleteMany();
  await prisma.document.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await cleanDB();
  console.log('Database cleaned. Seeding new data...');

  const adminPassword = await bcrypt.hash('password123', 10);
  const managerPassword = await bcrypt.hash('password123', 10);
  const clientPassword = await bcrypt.hash('password123', 10);

  // 1. Users
  console.log('Seeding Users...');
  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@auradesign.studio', password: adminPassword, role: 'admin', avatar: 'A' }
  });

  const manager = await prisma.user.create({
    data: { name: 'Priya', email: 'priya@example.com', password: managerPassword, role: 'manager', avatar: 'P' }
  });

  const customer1 = await prisma.user.create({
    data: { name: 'Ananya Mehta', email: 'ananya@example.com', password: clientPassword, role: 'client', avatar: 'AM' }
  });

  const customer2 = await prisma.user.create({
    data: { name: 'Rohan Desai', email: 'rohan@example.com', password: clientPassword, role: 'client', avatar: 'RD' }
  });

  // 2. Projects
  console.log('Seeding Projects...');
  const proj1 = await prisma.project.create({
    data: {
      name: 'The Penthouse Residency',
      phase: 'Execution',
      health: 'green',
      budget: '₹28,20,000',
      completion: 40,
      startDate: 'Jan 2025',
      endDate: 'Nov 2025',
      managerId: manager.id,
      clientId: customer1.id
    }
  });

  const proj2 = await prisma.project.create({
    data: {
      name: 'Seaside Villa Renovation',
      phase: 'Design',
      health: 'amber',
      budget: '₹15,00,000',
      completion: 15,
      startDate: 'Mar 2025',
      endDate: 'Dec 2025',
      managerId: manager.id,
      clientId: customer2.id
    }
  });

  // 3. Conversations
  console.log('Seeding Conversations...');
  const conv1 = await prisma.conversation.create({
    data: {
      projectId: proj1.id,
      type: 'GROUP',
      title: 'Penthouse General Chat',
      participants: JSON.stringify([customer1.id, admin.id, manager.id]),
      lastActivity: new Date().toISOString()
    }
  });

  const conv2 = await prisma.conversation.create({
    data: {
      projectId: proj2.id,
      type: 'GROUP',
      title: 'Seaside Villa Updates',
      participants: JSON.stringify([customer2.id, admin.id, manager.id]),
      lastActivity: new Date().toISOString()
    }
  });

  // 4. Messages
  console.log('Seeding Messages...');
  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: manager.id,
        content: 'Hi Ananya! We have successfully procured the Italian marble for the living room.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        readBy: JSON.stringify([{ userId: customer1.id, timestamp: new Date().toISOString() }])
      },
      {
        conversationId: conv1.id,
        senderId: customer1.id,
        content: 'That sounds amazing Suresh. When will the installation begin?',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        readBy: JSON.stringify([])
      },
      {
        conversationId: conv2.id,
        senderId: admin.id,
        content: 'Welcome Rohan. We will share the initial moodboards by next Friday.',
        timestamp: new Date().toISOString(),
        readBy: '[]'
      }
    ]
  });

  // 5. Invoices
  console.log('Seeding Invoices...');
  await prisma.invoice.createMany({
    data: [
      {
        ref: 'AUR-2025-001',
        amount: '₹3,50,000',
        status: 'paid',
        date: 'Jan 10',
        clientId: customer1.id,
        projectId: proj1.id
      },
      {
        ref: 'AUR-2025-002',
        amount: '₹4,20,000',
        status: 'paid',
        date: 'Feb 15',
        clientId: customer1.id,
        projectId: proj1.id
      },
      {
        ref: 'AUR-2025-003',
        amount: '₹8,00,000',
        status: 'paid',
        date: 'Mar 01',
        clientId: customer1.id,
        projectId: proj1.id
      },
      {
        ref: 'AUR-2025-004',
        amount: '₹5,50,000',
        status: 'pending',
        date: 'Jun 01',
        clientId: customer1.id,
        projectId: proj1.id
      },
      {
        ref: 'AUR-2025-005',
        amount: '₹2,00,000',
        status: 'pending',
        date: 'May 05',
        clientId: customer2.id,
        projectId: proj2.id
      }
    ]
  });

  // 6. Documents
  console.log('Seeding Documents...');
  await prisma.document.createMany({
    data: [
      {
        name: 'Floor Plan Rev A.pdf',
        type: 'PDF',
        date: 'Apr 2',
        size: '4.5 MB',
        projectId: proj1.id,
        uploadedById: manager.id,
        url: '/mock/floor_plan.pdf'
      },
      {
        name: 'Moodboard - Master Bedroom.jpg',
        type: 'IMG',
        date: 'Apr 5',
        size: '12 MB',
        projectId: proj1.id,
        uploadedById: manager.id,
        url: '/mock/moodboard.jpg'
      },
      {
        name: 'Electrical Layout V2.pdf',
        type: 'PDF',
        date: 'Apr 12',
        size: '2.1 MB',
        projectId: proj1.id,
        uploadedById: manager.id,
        url: '/mock/electrical_layout.pdf'
      },
      {
        name: 'Client Contract.pdf',
        type: 'PDF',
        date: 'Jan 05',
        size: '8.4 MB',
        projectId: proj1.id,
        uploadedById: admin.id,
        url: '/mock/contract.pdf'
      }
    ]
  });

  // 7. Approvals
  console.log('Seeding Approvals...');
  await prisma.approval.createMany({
    data: [
      {
        title: 'Master Bedroom False Ceiling Design',
        type: 'Design',
        status: 'pending',
        due: 'Apr 15',
        description: 'Please review the attached false ceiling layout for the master bedroom.',
        projectId: proj1.id
      },
      {
        title: 'Living Room Flooring Material',
        type: 'Material',
        status: 'approved',
        due: 'Mar 25',
        description: 'Approval for the imported Italian marble.',
        projectId: proj1.id
      }
    ]
  });

  // 8. Site Logs
  console.log('Seeding Site Logs...');
  await prisma.siteLog.createMany({
    data: [
      {
        title: 'Electrical Concealing Started',
        summary: 'Completed marking and chipping for electrical conduits in living room and kitchen.',
        date: 'Apr 12',
        crew: 5,
        progress: 15,
        photos: '[]',
        projectId: proj1.id
      },
      {
        title: 'Material Delivery - Cement & Sand',
        summary: 'Received 50 bags of cement and 2 brass of river sand at site.',
        date: 'Apr 10',
        crew: 2,
        progress: 10,
        photos: '[]',
        projectId: proj1.id
      }
    ]
  });

  // 8b. Issues
  console.log('Seeding Issues...');
  await prisma.issue.createMany({
    data: [
      {
        title: 'Plumbing material delay',
        priority: 'high',
        status: 'open',
        date: 'Apr 16',
        assignee: 'Suresh',
        projectId: proj1.id
      },
      {
        title: 'Client approval needed for bathroom tiles',
        priority: 'medium',
        status: 'in-progress',
        date: 'Apr 14',
        assignee: 'Ananya Mehta',
        projectId: proj1.id
      }
    ]
  });

  // 9. Tasks
  console.log('Seeding Tasks...');
  await prisma.task.createMany({
    data: [
      {
        label: 'Finalize Lighting Fixtures',
        done: false,
        assignee: 'Suresh',
        due: 'Apr 18',
        projectId: proj1.id
      },
      {
        label: 'Approve Kitchen Layout',
        done: false,
        assignee: 'Ananya Mehta',
        due: 'Apr 20',
        projectId: proj1.id
      }
    ]
  });

  // 10. Notifications
  console.log('Seeding Notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: 'New message from Suresh',
        message: 'Hi Ananya! We have successfully procured the...',
        read: false
      },
      {
        userId: customer1.id,
        title: 'Invoice AUR-2025-004 Generated',
        message: 'A new invoice for ₹5,50,000 has been added to your account.',
        read: false
      },
      {
        userId: admin.id,
        title: 'Project Update',
        message: 'Electrical concealing started at Penthouse Residency',
        read: false
      }
    ]
  });

  console.log('All dummy data seeded successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
