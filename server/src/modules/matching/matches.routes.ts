import { Router, Response } from 'express';
import { prisma } from '../../prisma/client';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { emitTaskUpdated } from '../../socket';

const router = Router();

// POST /api/matches/:id/accept (Helper accepts matched request)
router.post('/:id/accept', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: { request: true },
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        error: { code: 'MATCH_NOT_FOUND', message: 'Match record not found' },
      });
    }

    // Check if task is already taken
    const existingTask = await prisma.task.findFirst({
      where: {
        requestId: match.requestId,
        status: { in: ['ACCEPTED', 'IN_PROGRESS', 'ARRIVED', 'PROOF_SUBMITTED', 'AWAITING_VERIFICATION', 'RESOLVED'] },
      },
    });

    if (existingTask) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_ACCEPTED', message: 'This request has already been accepted by another helper' },
      });
    }

    // Create Task record
    const task = await prisma.task.create({
      data: {
        requestId: match.requestId,
        helperId: req.user!.id,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        etaMinutes: 15,
      },
      include: {
        request: {
          include: {
            creator: { select: { id: true, name: true, phone: true } },
          },
        },
        helper: {
          select: { id: true, name: true, phone: true, trustScore: true },
        },
      },
    });

    // Update match status & request status
    await prisma.match.update({
      where: { id: match.id },
      data: { status: 'ACCEPTED' },
    });

    await prisma.request.update({
      where: { id: match.requestId },
      data: { status: 'ACCEPTED' },
    });

    emitTaskUpdated(task.id, {
      taskId: task.id,
      status: 'ACCEPTED',
      task,
      helperId: req.user!.id,
      requesterId: task.request.creator.id,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

export default router;
