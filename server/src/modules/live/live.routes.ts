import { Router } from 'express';
import { prisma } from '../../prisma/client';

const router = Router();

// GET /api/live (Realtime aggregated civic activity & radar data)
router.get('/', async (req, res) => {
  try {
    const totalRequests = await prisma.request.count();
    const activeRequests = await prisma.request.count({
      where: { status: { in: ['PUBLISHED', 'MATCHING', 'MATCHED', 'ACCEPTED', 'IN_PROGRESS', 'ARRIVED'] } },
    });
    const helpersOnline = await prisma.user.count({
      where: { role: 'HELPER' },
    });
    const resolvedTasks = await prisma.task.count({
      where: { status: 'RESOLVED' },
    });

    const requests = await prisma.request.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        status: true,
        title: true,
        category: true,
        urgency: true,
        lat: true,
        lng: true,
        locationText: true,
        affectedCount: true,
        createdAt: true,
      },
    });

    const recentResolutions = await prisma.task.findMany({
      where: { status: 'RESOLVED' },
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: {
        request: { select: { title: true, locationText: true } },
        helper: { select: { name: true } },
        proofs: { take: 1 },
      },
    });

    const realTicker = recentResolutions.map((task) => ({
      location: task.request?.locationText || 'Indore',
      text: `${task.request?.title || 'Community Request'} resolved by ${task.helper?.name || 'Helper'}`,
      timeAgo: 'Recently',
    }));

    return res.json({
      success: true,
      data: {
        counters: {
          activeRequests,
          helpersOnline,
          problemsSolved: resolvedTasks,
          totalRequests,
          fees: '₹0 Platform Fee',
        },
        ticker: realTicker,
        requests,
        recentResolutions,
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
