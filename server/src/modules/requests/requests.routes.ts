import { Router, Response } from 'express';
import { prisma } from '../../prisma/client';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../../middleware/auth';
import { AIService } from '../ai/ai.service';
import { MatchingService } from '../matching/matching.service';
import { calculateHaversineDistance } from '../../utils/geo';
import { emitLiveRequestCreated, emitTaskUpdated } from '../../socket';

const router = Router();

// GET /api/requests (Explore & browse requests)
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      type,
      urgency,
      category,
      status,
      search,
      lat,
      lng,
      radiusKm = 20,
    } = req.query;

    const where: any = {};

    if (type && type !== 'ALL') where.type = String(type);
    if (urgency && urgency !== 'ALL') where.urgency = String(urgency);
    if (category && category !== 'ALL') where.category = String(category);
    if (status && status !== 'ALL') {
      where.status = String(status);
    } else {
      // Default: show matchable / active requests
      where.status = { in: ['PUBLISHED', 'MATCHING', 'MATCHED', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED'] };
    }

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { locationText: { contains: q } },
      ];
    }

    const requests = await prisma.request.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { id: true, name: true, city: true, trustScore: true },
        },
        aiAudit: true,
        tasks: {
          select: { id: true, status: true, helperId: true },
        },
      },
    });

    // If coordinates provided, filter/sort by distance
    let results = requests;
    if (lat && lng) {
      const uLat = parseFloat(String(lat));
      const uLng = parseFloat(String(lng));
      const maxR = parseFloat(String(radiusKm));

      results = requests
        .map((r) => {
          const distanceKm = calculateHaversineDistance(uLat, uLng, r.lat, r.lng);
          return { ...r, distanceKm };
        })
        .filter((r) => r.distanceKm <= maxR)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return res.json({
      success: true,
      data: results,
      meta: { count: results.length },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/requests (Create request)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      type = 'REPORT',
      title,
      description,
      category,
      urgency,
      lat = 22.7196,
      lng = 75.8577,
      locationText = 'Indore, Madhya Pradesh',
      affectedCount = 1,
      autoPublish = true,
      aiData,
    } = req.body;

    if (!description && !title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Description or title is required' },
      });
    }

    // Run AI extraction if category or urgency not provided
    let aiParsed = aiData;
    if (!aiParsed) {
      aiParsed = await AIService.understandRequest(`${title || ''} ${description || ''}`);
    }

    const finalTitle = title || (description.length > 50 ? description.slice(0, 50) + '...' : description);
    const finalCategory = category || aiParsed.category || 'GENERAL';
    const finalUrgency = urgency || aiParsed.urgency || 'MEDIUM';
    const finalAffected = affectedCount || aiParsed.affectedCount || 1;

    const request = await prisma.request.create({
      data: {
        creatorId: req.user!.id,
        type,
        status: autoPublish ? 'MATCHING' : 'DRAFT',
        title: finalTitle,
        description: description || finalTitle,
        category: finalCategory,
        urgency: finalUrgency,
        lat: Number(lat),
        lng: Number(lng),
        locationText,
        affectedCount: finalAffected,
        aiAudit: {
          create: {
            modelVersion: 'openhand-triage-v1',
            summary: aiParsed.summary || finalTitle,
            categorySuggestion: aiParsed.category || finalCategory,
            urgencySuggestion: aiParsed.urgency || finalUrgency,
            affectedCount: finalAffected,
            keywords: JSON.stringify(aiParsed.keywords || []),
            duplicateScore: 0.0,
            confidence: aiParsed.confidence || 0.92,
          },
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, city: true, trustScore: true },
        },
        aiAudit: true,
      },
    });

    // If auto-published, calculate matches immediately
    if (autoPublish) {
      await MatchingService.matchHelpersForRequest(request.id);
      emitLiveRequestCreated(request);
    }

    return res.status(201).json({
      success: true,
      data: request,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/requests/:id
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          select: { id: true, name: true, email: true, city: true, trustScore: true, phone: true },
        },
        aiAudit: true,
        matches: {
          include: {
            helper: {
              select: { id: true, name: true, email: true, city: true, trustScore: true, bio: true },
            },
          },
          orderBy: { score: 'desc' },
        },
        tasks: {
          include: {
            helper: {
              select: { id: true, name: true, email: true, phone: true, trustScore: true },
            },
            proofs: true,
          },
        },
        verifications: true,
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'REQUEST_NOT_FOUND', message: 'Request not found' },
      });
    }

    return res.json({
      success: true,
      data: request,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// PATCH /api/requests/:id (Owner edits fields)
router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.request.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Request not found' },
      });
    }

    if (existing.creatorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not own this request' },
      });
    }

    const { title, description, category, urgency, locationText, lat, lng, affectedCount } = req.body;

    const updated = await prisma.request.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(urgency && { urgency }),
        ...(locationText && { locationText }),
        ...(lat && { lat: Number(lat) }),
        ...(lng && { lng: Number(lng) }),
        ...(affectedCount && { affectedCount: Number(affectedCount) }),
      },
      include: {
        creator: true,
        aiAudit: true,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/requests/:id/publish (Publish from draft or trigger matching)
router.post('/:id/publish', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const request = await prisma.request.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Request not found' },
      });
    }

    const updated = await prisma.request.update({
      where: { id: req.params.id },
      data: { status: 'MATCHING' },
    });

    const matches = await MatchingService.matchHelpersForRequest(request.id);
    emitLiveRequestCreated(updated);

    return res.json({
      success: true,
      data: { request: updated, matches },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/requests/:id/matches (Get ranked matches)
router.get('/:id/matches', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let matches = await prisma.match.findMany({
      where: { requestId: req.params.id },
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            trustScore: true,
            bio: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { score: 'desc' },
    });

    // If no matches yet, compute them!
    if (matches.length === 0) {
      await MatchingService.matchHelpersForRequest(req.params.id);
      matches = await prisma.match.findMany({
        where: { requestId: req.params.id },
        include: {
          helper: {
            select: {
              id: true,
              name: true,
              email: true,
              city: true,
              trustScore: true,
              bio: true,
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { score: 'desc' },
      });
    }

    return res.json({ success: true, data: matches });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/requests/:id/verify (Requester verifies outcome)
router.post('/:id/verify', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { outcome = 'CONFIRMED', comment = '', rating = 5 } = req.body;
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: { tasks: true },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Request not found' },
      });
    }

    if (request.creatorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only the requester can verify resolution' },
      });
    }

    const verification = await prisma.verification.create({
      data: {
        requestId: request.id,
        requesterId: req.user!.id,
        outcome,
        comment,
        rating: Number(rating),
      },
    });

    const newRequestStatus = outcome === 'CONFIRMED' ? 'RESOLVED' : 'REWORK_REQUESTED';
    const newTaskStatus = outcome === 'CONFIRMED' ? 'RESOLVED' : 'REWORK_REQUESTED';

    await prisma.request.update({
      where: { id: request.id },
      data: { status: newRequestStatus },
    });

    // Update active tasks
    for (const t of request.tasks) {
      await prisma.task.update({
        where: { id: t.id },
        data: {
          status: newTaskStatus,
          ...(outcome === 'CONFIRMED' && { completedAt: new Date() }),
        },
      });
      emitTaskUpdated(t.id, {
        taskId: t.id,
        status: newTaskStatus,
        verification,
        helperId: t.helperId,
        requesterId: request.creatorId,
      });
    }

    return res.json({
      success: true,
      data: {
        verification,
        requestStatus: newRequestStatus,
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
