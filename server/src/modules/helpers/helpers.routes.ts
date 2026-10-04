import { Router, Response } from 'express';
import { prisma } from '../../prisma/client';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { calculateHaversineDistance } from '../../utils/geo';

const router = Router();

// PATCH /api/helpers/me/availability
router.patch('/me/availability', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isAvailable, radiusKm, lat, lng } = req.body;

    const availability = await prisma.availability.upsert({
      where: { userId: req.user!.id },
      update: {
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(radiusKm !== undefined && { radiusKm: Number(radiusKm) }),
        ...(lat !== undefined && { lat: Number(lat) }),
        ...(lng !== undefined && { lng: Number(lng) }),
      },
      create: {
        userId: req.user!.id,
        isAvailable: isAvailable ?? true,
        radiusKm: radiusKm ? Number(radiusKm) : 5.0,
        lat: lat ? Number(lat) : 22.7196,
        lng: lng ? Number(lng) : 75.8577,
      },
    });

    return res.json({ success: true, data: availability });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/helpers/me/opportunities (Ranked opportunities for logged-in helper)
router.get('/me/opportunities', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const helperId = req.user!.id;
    const matches = await prisma.match.findMany({
      where: {
        helperId,
        request: {
          status: { in: ['PUBLISHED', 'MATCHING', 'MATCHED'] },
        },
      },
      include: {
        request: {
          include: {
            creator: { select: { id: true, name: true, city: true, trustScore: true } },
            aiAudit: true,
          },
        },
      },
      orderBy: { score: 'desc' },
    });

    return res.json({ success: true, data: matches });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/helpers/me/tasks
router.get('/me/tasks', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { helperId: req.user!.id },
      include: {
        request: {
          include: {
            creator: { select: { id: true, name: true, phone: true } },
          },
        },
        proofs: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: tasks });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

export default router;
