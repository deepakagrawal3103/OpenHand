import { Router } from 'express';
import { AIService } from './ai.service';

const router = Router();

// POST /api/ai/understand-request
router.post('/understand-request', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Text field is required' },
      });
    }

    const understanding = await AIService.understandRequest(text);
    return res.json({
      success: true,
      data: understanding,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'AI_SERVICE_ERROR', message: err.message },
    });
  }
});

// POST /api/ai/check-duplicate
router.post('/check-duplicate', async (req, res) => {
  try {
    const { title = '', description = '', category = 'GENERAL', type = 'REPORT', lat = 22.7196, lng = 75.8577, excludeRequestId } = req.body;

    const duplicateCheck = await AIService.checkDuplicate({
      title,
      description,
      category,
      type,
      lat: Number(lat),
      lng: Number(lng),
      excludeRequestId,
    });

    return res.json({
      success: true,
      data: duplicateCheck,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'AI_DUPLICATE_ERROR', message: err.message },
    });
  }
});

export default router;
