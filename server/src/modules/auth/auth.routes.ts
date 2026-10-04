import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'openhand_dev_jwt_secret_indore_2026';

function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      role = 'USER',
      phone,
      city = 'Indore',
      entityType = 'INDIVIDUAL',
      ngoCategory,
      wishlistTags,
      primarySkill,
      visitFee,
      whatsappNotifications = true,
      whatsappNumber,
      bio,
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email, password and name are required' },
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'User with this email already exists' },
      });
    }

    const effectiveRole = entityType === 'NGO' ? 'ORGANIZATION' : (entityType === 'SKILLED_WORKER' ? 'HELPER' : role);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: effectiveRole,
        phone,
        city,
        bio: bio || (entityType === 'NGO' ? `Verified NGO: ${name}` : (entityType === 'SKILLED_WORKER' ? `Skilled Technician: ${primarySkill}` : 'Indore Student & Citizen')),
        trustScore: 92,
        entityType,
        ngoCategory,
        wishlistTags,
        primarySkill,
        visitFee: visitFee ? Number(visitFee) : null,
        whatsappNotifications: Boolean(whatsappNotifications),
        whatsappNumber: whatsappNumber || phone,
        availability: {
          create: {
            isAvailable: true,
            radiusKm: 5.0,
            lat: 22.7196,
            lng: 75.8577,
          },
        },
      },
      include: {
        availability: true,
        skills: { include: { skill: true } },
      },
    });

    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;

    return res.status(201).json({
      success: true,
      data: { user: safeUser, token },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        availability: true,
        skills: { include: { skill: true } },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const token = generateToken(user.id);
    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      data: { user: safeUser, token },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        availability: true,
        skills: { include: { skill: true } },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ success: true, data: safeUser });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// PATCH /api/me
router.patch('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      phone,
      city,
      bio,
      role,
      skills,
      entityType,
      ngoCategory,
      wishlistTags,
      primarySkill,
      visitFee,
      whatsappNotifications,
      whatsappNumber,
    } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(city !== undefined && { city }),
        ...(bio !== undefined && { bio }),
        ...(role !== undefined && { role }),
        ...(entityType !== undefined && { entityType }),
        ...(ngoCategory !== undefined && { ngoCategory }),
        ...(wishlistTags !== undefined && { wishlistTags }),
        ...(primarySkill !== undefined && { primarySkill }),
        ...(visitFee !== undefined && { visitFee: visitFee ? Number(visitFee) : null }),
        ...(whatsappNotifications !== undefined && { whatsappNotifications: Boolean(whatsappNotifications) }),
        ...(whatsappNumber !== undefined && { whatsappNumber }),
      },
      include: {
        availability: true,
        skills: { include: { skill: true } },
      },
    });

    // If new skill tags were passed
    if (Array.isArray(skills)) {
      for (const skillName of skills) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName, category: 'General' },
          });
        }
        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: req.user!.id,
              skillId: skill.id,
            },
          },
          update: {},
          create: {
            userId: req.user!.id,
            skillId: skill.id,
            level: 'INTERMEDIATE',
            verified: false,
          },
        });
      }
    }

    const { passwordHash: _, ...safeUser } = updated;
    return res.json({ success: true, data: safeUser });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/me/suitable-matches
// Returns personalized matched items, donations, or work requests for the logged-in user
router.get('/me/suitable-matches', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        skills: { include: { skill: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    const entityType = user.entityType || 'INDIVIDUAL';
    const allRequests = await prisma.request.findMany({
      where: {
        status: { in: ['PUBLISHED', 'MATCHING', 'ACCEPTED'] },
      },
      include: {
        creator: { select: { id: true, name: true, phone: true, city: true } },
        aiAudit: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    let matchedItems: any[] = [];
    let matchReason = '';

    if (entityType === 'NGO') {
      matchReason = `Matched for your NGO wishlist (${user.wishlistTags || 'Surplus & Donations in Indore'})`;
      // Giveaways and surplus donations
      matchedItems = allRequests
        .filter((r) => r.type === 'GIVE' || r.type === 'NEED')
        .map((r) => ({
          id: r.id,
          type: 'DONATION',
          title: r.title,
          description: r.description,
          location: r.locationText,
          urgency: r.urgency,
          donorName: r.creator.name,
          donorContact: r.creator.phone || '+91 98260 12345',
          matchScore: 95,
          category: r.category,
          actionLabel: 'Claim Donation for NGO',
        }));
    } else if (entityType === 'SKILLED_WORKER') {
      const skillName = user.primarySkill || (user.skills[0]?.skill.name) || 'Hardware & Maintenance';
      matchReason = `Matched for your trade & skills (${skillName})`;
      matchedItems = allRequests
        .filter((r) => r.type === 'REPORT' || r.type === 'SERVICE' || r.type === 'NEED')
        .map((r) => ({
          id: r.id,
          type: 'WORK_ORDER',
          title: r.title,
          description: r.description,
          location: r.locationText,
          urgency: r.urgency,
          requesterName: r.creator.name,
          requesterContact: r.creator.phone || '+91 98260 12345',
          visitFee: user.visitFee || 200,
          matchScore: 92,
          category: r.category,
          actionLabel: 'Accept Work & Contact Requester',
        }));
    } else {
      matchReason = 'Active campus community items and peer requests in Indore';
      matchedItems = allRequests.slice(0, 5).map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        location: r.locationText,
        urgency: r.urgency,
        contactName: r.creator.name,
        contactPhone: r.creator.phone,
        matchScore: 88,
        category: r.category,
        actionLabel: 'Connect',
      }));
    }

    return res.json({
      success: true,
      data: {
        entityType,
        matchReason,
        whatsappNotifications: user.whatsappNotifications,
        whatsappNumber: user.whatsappNumber || user.phone,
        items: matchedItems,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/alerts/whatsapp
// Formats and generates a WhatsApp message notification link (wa.me)
router.post('/alerts/whatsapp', async (req, res) => {
  try {
    const {
      recipientName,
      recipientPhone = '+919826012345',
      type = 'DONATION', // DONATION or WORK_REQUEST or MARKETPLACE
      title,
      location = 'Indore',
      contactPerson,
      fee,
    } = req.body;

    const cleanNumber = recipientPhone.replace(/[^0-9]/g, '');

    let messageText = '';
    if (type === 'DONATION') {
      messageText = `🙏 *OpenHand Indore Alert*\nNamaste ${recipientName || 'Ji'},\nA new donation matching your NGO wishlist has been posted!\n\n📦 *Item:* ${title}\n📍 *Location:* ${location}\n👤 *Donor:* ${contactPerson || 'Verified Citizen'}\n\n👉 OpenHand: http://localhost:5173/donate\nPlease claim or coordinate pickup directly.`;
    } else if (type === 'WORK_REQUEST') {
      messageText = `🔧 *OpenHand Work Alert*\nNamaste ${recipientName || 'Mistri Ji'},\nA new repair job matching your skill is available nearby!\n\n🔨 *Task:* ${title}\n📍 *Location:* ${location}\n💰 *Visit Fee:* ₹${fee || 200}\n👤 *Requester:* ${contactPerson || 'Verified Campus Resident'}\n\n👉 OpenHand: http://localhost:5173/services\nReply or call directly to confirm visit!`;
    } else {
      messageText = `📢 *OpenHand Community Alert*\nNamaste ${recipientName || 'Friend'},\nA new item or request matching your alert was posted:\n🏷️ *${title}*\n📍 *Location:* ${location}\n\n👉 OpenHand: http://localhost:5173/marketplace`;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;

    return res.json({
      success: true,
      data: {
        recipientNumber: cleanNumber,
        messageText,
        whatsappUrl,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

export default router;
