import { Router, Response } from 'express';
import { prisma } from '../../prisma/client';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { emitTaskUpdated, emitMessageNew, emitProofSubmitted } from '../../socket';

const router = Router();

// Task lifecycle routes

// GET /api/tasks/:id
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        request: {
          include: {
            creator: { select: { id: true, name: true, email: true, phone: true, trustScore: true } },
            aiAudit: true,
            verifications: true,
          },
        },
        helper: {
          select: { id: true, name: true, email: true, phone: true, trustScore: true, bio: true },
        },
        proofs: {
          orderBy: { uploadedAt: 'desc' },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// PATCH /api/tasks/:id/status (Server-enforced State Machine)
router.patch('/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, etaMinutes } = req.body;
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        request: true,
        proofs: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    const isHelper = task.helperId === req.user!.id;
    const isRequester = task.request.creatorId === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isHelper && !isRequester && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only task participants can update status' },
      });
    }

    // TRD Section 6.3 State Machine Rules:
    // 1. Requester cannot mark task as PROOF_SUBMITTED
    if (status === 'PROOF_SUBMITTED' && !isHelper && !isAdmin) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TRANSITION', message: 'Only the assigned helper can submit proof' },
      });
    }

    // 2. Helper cannot directly mark RESOLVED without proof & verification
    if (status === 'RESOLVED' && !isRequester && !isAdmin) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TRANSITION', message: 'Only the requester can verify resolution' },
      });
    }

    if (status === 'RESOLVED' && task.proofs.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PROOF', message: 'Cannot mark resolved without uploaded proof' },
      });
    }

    const updateData: any = { status };
    if (etaMinutes !== undefined) updateData.etaMinutes = Number(etaMinutes);
    if (status === 'IN_PROGRESS' && !task.startedAt) updateData.startedAt = new Date();
    if (status === 'ARRIVED' && !task.arrivedAt) updateData.arrivedAt = new Date();
    if (status === 'RESOLVED') updateData.completedAt = new Date();

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: updateData,
      include: {
        request: { include: { creator: true } },
        helper: true,
        proofs: true,
      },
    });

    // Mirror status to Request
    await prisma.request.update({
      where: { id: task.requestId },
      data: { status },
    });

    emitTaskUpdated(task.id, {
      taskId: task.id,
      status,
      task: updatedTask,
      helperId: task.helperId,
      requesterId: task.request.creatorId,
    });

    return res.json({ success: true, data: updatedTask });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/tasks/:id/proof (Upload proof evidence)
router.post('/:id/proof', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mediaUrl, note = '', type = 'AFTER' } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'mediaUrl is required for proof' },
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { request: true },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    if (task.helperId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only assigned helper can submit proof' },
      });
    }

    const proof = await prisma.proof.create({
      data: {
        taskId: task.id,
        mediaUrl,
        note,
        type,
      },
    });

    // Advance task status to PROOF_SUBMITTED
    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: { status: 'PROOF_SUBMITTED' },
      include: { proofs: true, request: true, helper: true },
    });

    await prisma.request.update({
      where: { id: task.requestId },
      data: { status: 'AWAITING_VERIFICATION' },
    });

    emitProofSubmitted(task.id, {
      taskId: task.id,
      proof,
      status: 'PROOF_SUBMITTED',
      requesterId: task.request.creatorId,
    });

    return res.status(201).json({
      success: true,
      data: { proof, task: updatedTask },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /api/tasks/:id/messages
router.get('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { taskId: req.params.id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return res.json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// POST /api/tasks/:id/messages (Send task chat message)
router.post('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, actionType } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Text is required' },
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { request: true },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    const message = await prisma.message.create({
      data: {
        taskId: task.id,
        senderId: req.user!.id,
        text,
        actionType,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    emitMessageNew(task.id, message);

    return res.status(201).json({ success: true, data: message });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

export default router;
