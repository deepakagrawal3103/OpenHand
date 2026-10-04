import { prisma } from './client';
import bcrypt from 'bcryptjs';

export async function seed() {
  console.log('🌱 Seeding OpenHand database...');

  // Clean old data
  await prisma.verification.deleteMany({});
  await prisma.proof.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.requestAI.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Skills
  const skillsData = [
    { name: 'Hardware Diagnostics', category: 'Hardware' },
    { name: 'Component Soldering', category: 'Hardware' },
    { name: 'Power Supply & Batteries', category: 'Hardware' },
    { name: 'Linux OS & Networking', category: 'Software' },
    { name: 'Multimeter Testing', category: 'Electrical' },
    { name: '3D Printer Calibration', category: 'Tools' },
  ];

  const skillMap: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }

  // 2. Create Users
  // Canonical Requester: Priya Sharma
  const requester = await prisma.user.create({
    data: {
      email: 'priya@college.edu',
      passwordHash: defaultPassword,
      name: 'Priya Sharma',
      role: 'USER',
      phone: '+91 98260 12345',
      city: 'Indore',
      bio: 'B.Tech CS Student at SGSITS Indore. Lab representative.',
      trustScore: 92,
    },
  });

  // Canonical Helper: Aarav Patel
  const helperAarav = await prisma.user.create({
    data: {
      email: 'aarav@openhand.org',
      passwordHash: defaultPassword,
      name: 'Aarav Patel',
      role: 'HELPER',
      phone: '+91 98260 54321',
      city: 'Indore',
      bio: 'Hardware tinkerer, electronics enthusiast, 18+ campus repairs completed.',
      trustScore: 96,
      availability: {
        create: {
          isAvailable: true,
          radiusKm: 3.5,
          lat: 22.7230,
          lng: 75.8610,
        },
      },
    },
  });

  // Additional Helpers
  const helperSneha = await prisma.user.create({
    data: {
      email: 'sneha@openhand.org',
      passwordHash: defaultPassword,
      name: 'Sneha Rao',
      role: 'HELPER',
      city: 'Indore',
      bio: 'Microcontroller systems and embedded firmware specialist.',
      trustScore: 88,
      availability: {
        create: {
          isAvailable: true,
          radiusKm: 5.0,
          lat: 22.7150,
          lng: 75.8500,
        },
      },
    },
  });

  // Attach Skills to Aarav
  await prisma.userSkill.createMany({
    data: [
      { userId: helperAarav.id, skillId: skillMap['Hardware Diagnostics'], level: 'EXPERT', verified: true },
      { userId: helperAarav.id, skillId: skillMap['Power Supply & Batteries'], level: 'EXPERT', verified: true },
      { userId: helperAarav.id, skillId: skillMap['Component Soldering'], level: 'INTERMEDIATE', verified: true },
    ],
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: helperSneha.id, skillId: skillMap['Linux OS & Networking'], level: 'EXPERT', verified: true },
      { userId: helperSneha.id, skillId: skillMap['Multimeter Testing'], level: 'INTERMEDIATE', verified: true },
    ],
  });

  // 3. Create Canonical Demo Request: "Lab 3 PCs won't boot"
  const canonicalRequest = await prisma.request.create({
    data: {
      creatorId: requester.id,
      type: 'REPORT',
      status: 'MATCHING',
      title: "Lab 3 PCs won't boot",
      description: "Multiple workstations in College Lab 3 fail to turn on before morning practicals. Fans spin briefly and shut off immediately. Suspected CMOS battery failure or power distribution trip.",
      category: 'COMPUTER_HARDWARE',
      urgency: 'HIGH',
      lat: 22.7196,
      lng: 75.8577,
      locationText: 'College Lab 3, SGSITS CS Wing, Indore',
      affectedCount: 14,
      aiAudit: {
        create: {
          modelVersion: 'openhand-triage-v1',
          summary: '14 students blocked. Critical lab infrastructure failure requiring immediate hardware & power check.',
          categorySuggestion: 'COMPUTER_HARDWARE',
          urgencySuggestion: 'HIGH',
          affectedCount: 14,
          keywords: JSON.stringify(['PC', 'boot', 'lab 3', 'power', 'workstations', 'CMOS']),
          duplicateScore: 0.05,
          confidence: 0.94,
        },
      },
    },
  });

  // 4. Create Canonical 92% Match with Aarav
  await prisma.match.create({
    data: {
      requestId: canonicalRequest.id,
      helperId: helperAarav.id,
      score: 92,
      skillFit: 96,
      distance: 94,
      availability: 100,
      experience: 82,
      trust: 88,
      distanceKm: 0.8,
      explanation: 'Strong hardware skills • 0.8 km away • Available now • 18 completed tasks • Trusted profile',
      status: 'SUGGESTED',
    },
  });

  // Second candidate match (Sneha)
  await prisma.match.create({
    data: {
      requestId: canonicalRequest.id,
      helperId: helperSneha.id,
      score: 74,
      skillFit: 70,
      distance: 82,
      availability: 95,
      experience: 65,
      trust: 85,
      distanceKm: 1.6,
      explanation: 'General systems skill • 1.6 km away • Available now',
      status: 'SUGGESTED',
    },
  });

  // 5. Seed Additional Civic Requests across Indore representing all 4 typologies
  // NEED
  await prisma.request.create({
    data: {
      creatorId: requester.id,
      type: 'NEED',
      status: 'PUBLISHED',
      title: 'Borrow digital multimeter and mini wire stripper',
      description: 'Urgent need for precision multimeter to test breadboard circuit voltages for IoT lab project.',
      category: 'TOOLS',
      urgency: 'MEDIUM',
      lat: 22.7210,
      lng: 75.8600,
      locationText: 'Indore EE Block 2nd Floor',
      affectedCount: 2,
    },
  });

  // GIVE
  await prisma.request.create({
    data: {
      creatorId: helperAarav.id,
      type: 'GIVE',
      status: 'PUBLISHED',
      title: '2x CR2032 Lithium Cells & spare jumper wire bundle',
      description: 'Fresh surplus coin cell batteries and female-to-female jumper wires available for student hardware teams.',
      category: 'HARDWARE',
      urgency: 'LOW',
      lat: 22.7240,
      lng: 75.8620,
      locationText: 'ECE Innovation Hub, Bhawarkua',
      affectedCount: 5,
    },
  });

  // SERVICE
  await prisma.request.create({
    data: {
      creatorId: helperSneha.id,
      type: 'SERVICE',
      status: 'PUBLISHED',
      title: '3D Printer bed leveling & Marlin firmware tuning clinic',
      description: 'Offering hands-on setup, extrusion temperature tuning, and bed calibration for Ender 3 / Prusa printers.',
      category: 'TOOLS',
      urgency: 'LOW',
      lat: 22.7160,
      lng: 75.8540,
      locationText: 'Indore Makers Club, Old Palasia',
      affectedCount: 8,
    },
  });

  // An already Resolved Case Study request matching screen.png Case Study #291
  const resolvedReq = await prisma.request.create({
    data: {
      creatorId: requester.id,
      type: 'REPORT',
      status: 'RESOLVED',
      title: 'Lab 2 Network Gateway unresponsive',
      description: 'Subnet router dropped packets during final lab evaluations.',
      category: 'COMPUTER_HARDWARE',
      urgency: 'HIGH',
      lat: 22.7198,
      lng: 75.8579,
      locationText: 'College Lab 2, SGSITS CS Wing',
      affectedCount: 24,
    },
  });

  const resolvedTask = await prisma.task.create({
    data: {
      requestId: resolvedReq.id,
      helperId: helperAarav.id,
      status: 'RESOLVED',
      etaMinutes: 10,
      acceptedAt: new Date(Date.now() - 3600000 * 2),
      startedAt: new Date(Date.now() - 3600000 * 1.8),
      arrivedAt: new Date(Date.now() - 3600000 * 1.5),
      completedAt: new Date(Date.now() - 3600000),
    },
  });

  await prisma.proof.create({
    data: {
      taskId: resolvedTask.id,
      type: 'BEFORE',
      mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      note: 'Gateway router blinking amber warning LED; interface switch ports unresponsive.',
    },
  });

  await prisma.proof.create({
    data: {
      taskId: resolvedTask.id,
      type: 'AFTER',
      mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      note: 'Replaced faulty RJ45 patch cable, rebooted VLAN switch trunk. All 24 terminal pings 0% drop.',
    },
  });

  await prisma.verification.create({
    data: {
      requestId: resolvedReq.id,
      requesterId: requester.id,
      outcome: 'CONFIRMED',
      comment: 'Verified with departmental network switch. Lab restored in under 18 minutes!',
      rating: 5,
    },
  });

  console.log('✅ Seed completed successfully with Canonical Demo data!');
  console.log(`   Canonical Request ID: ${canonicalRequest.id}`);
  console.log(`   Requester: priya@college.edu (password123)`);
  console.log(`   Helper: aarav@openhand.org (password123)`);
}

if (require.main === module) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
