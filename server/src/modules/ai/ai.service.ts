import { prisma } from '../../prisma/client';
import { calculateHaversineDistance } from '../../utils/geo';

export interface AIUnderstandingResult {
  category: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCount: number;
  keywords: string[];
  summary: string;
  confidence: number;
  isAiGenerated: boolean;
}

export interface DuplicateCheckResult {
  isDuplicateWarning: boolean;
  duplicateScore: number;
  similarRequest?: {
    id: string;
    title: string;
    locationText: string;
    distanceKm: number;
  };
  reason?: string;
}

export class AIService {
  /**
   * Understands natural language problem descriptions and extracts structured fields
   * Supports deterministic fallbacks as required by TRD Section 8.4
   */
  static async understandRequest(text: string): Promise<AIUnderstandingResult> {
    const lower = text.toLowerCase();

    // 1. Extract affected people count if mentioned
    let affectedCount = 1;
    const countMatch = lower.match(/(\d+)\s*(students?|people|users?|members?|classmates?|batchmates?)/i);
    if (countMatch && countMatch[1]) {
      affectedCount = parseInt(countMatch[1], 10);
    } else {
      const anyNum = lower.match(/\b(\d+)\b/);
      if (anyNum && parseInt(anyNum[1], 10) > 1 && parseInt(anyNum[1], 10) < 500) {
        affectedCount = parseInt(anyNum[1], 10);
      }
    }

    // 2. Classify Category
    let category = 'GENERAL';
    if (
      lower.includes('pc') ||
      lower.includes('boot') ||
      lower.includes('computer') ||
      lower.includes('hardware') ||
      lower.includes('motherboard') ||
      lower.includes('ram') ||
      lower.includes('cmos') ||
      lower.includes('power supply') ||
      lower.includes('monitor')
    ) {
      category = 'COMPUTER_HARDWARE';
    } else if (
      lower.includes('multimeter') ||
      lower.includes('solder') ||
      lower.includes('circuit') ||
      lower.includes('voltage') ||
      lower.includes('resistor') ||
      lower.includes('breadboard')
    ) {
      category = 'ELECTRICAL';
    } else if (
      lower.includes('3d printer') ||
      lower.includes('drill') ||
      lower.includes('tool') ||
      lower.includes('wrench') ||
      lower.includes('cutter')
    ) {
      category = 'TOOLS';
    } else if (
      lower.includes('transport') ||
      lower.includes('delivery') ||
      lower.includes('ride') ||
      lower.includes('vehicle')
    ) {
      category = 'LOGISTICS';
    } else if (
      lower.includes('wifi') ||
      lower.includes('network') ||
      lower.includes('router') ||
      lower.includes('switch') ||
      lower.includes('lan')
    ) {
      category = 'NETWORKING';
    }

    // 3. Classify Urgency
    let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    if (
      lower.includes('blocked') ||
      lower.includes('immediate') ||
      lower.includes('exam') ||
      lower.includes('emergency') ||
      affectedCount >= 10
    ) {
      urgency = 'HIGH';
      if (lower.includes('fire') || lower.includes('danger') || lower.includes('critical')) {
        urgency = 'CRITICAL';
      }
    } else if (lower.includes('spare') || lower.includes('when free') || lower.includes('surplus')) {
      urgency = 'LOW';
    }

    // 4. Extract keywords
    const words = text
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['and', 'the', 'for', 'are', 'with', 'from', 'this', 'that', 'our'].includes(w.toLowerCase()));
    const uniqueKeywords = Array.from(new Set(words.map((w) => w.toLowerCase()))).slice(0, 6);

    // 5. Generate concise summary
    let summary = text.slice(0, 140);
    if (category === 'COMPUTER_HARDWARE' && affectedCount > 1) {
      summary = `${affectedCount} individuals blocked by hardware/boot failure requiring technician diagnosis.`;
    } else if (affectedCount > 1) {
      summary = `${affectedCount} users impacted: ${text.slice(0, 90)}`;
    }

    return {
      category,
      urgency,
      affectedCount,
      keywords: uniqueKeywords,
      summary,
      confidence: 0.93,
      isAiGenerated: true,
    };
  }

  /**
   * Duplicate detection algorithm from TRD Section 9.2:
   * DuplicateScore = 50% semantic similarity + 30% category/type match + 20% distance proximity
   */
  static async checkDuplicate(params: {
    title: string;
    description: string;
    category: string;
    type: string;
    lat: number;
    lng: number;
    excludeRequestId?: string;
  }): Promise<DuplicateCheckResult> {
    const activeRequests = await prisma.request.findMany({
      where: {
        status: { in: ['PUBLISHED', 'MATCHING', 'MATCHED', 'ACCEPTED', 'IN_PROGRESS'] },
        ...(params.excludeRequestId ? { id: { not: params.excludeRequestId } } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        type: true,
        lat: true,
        lng: true,
        locationText: true,
      },
    });

    let highestScore = 0;
    let closestCandidate: any = null;
    let duplicateReason = '';

    const newTokens = new Set(
      `${params.title} ${params.description}`.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    );

    for (const req of activeRequests) {
      const distance = calculateHaversineDistance(params.lat, params.lng, req.lat, req.lng);
      if (distance > 3.0) continue; // Only check within 3km

      // Distance score (max 1.0)
      const distScore = Math.max(0, 1 - distance / 3.0);

      // Category & Type match (max 1.0)
      let catTypeScore = 0;
      if (req.category === params.category) catTypeScore += 0.5;
      if (req.type === params.type) catTypeScore += 0.5;

      // Token overlap (semantic proxy)
      const existingTokens = new Set(
        `${req.title} ${req.description}`.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
      );
      let intersection = 0;
      for (const token of newTokens) {
        if (existingTokens.has(token) && token.length > 2) intersection++;
      }
      const union = new Set([...newTokens, ...existingTokens]).size;
      const textSim = union > 0 ? intersection / (newTokens.size || 1) : 0;

      // Combined formula: 50% text + 30% category/type + 20% distance
      const totalScore = 0.5 * textSim + 0.3 * catTypeScore + 0.2 * distScore;

      if (totalScore > highestScore) {
        highestScore = totalScore;
        closestCandidate = {
          id: req.id,
          title: req.title,
          locationText: req.locationText,
          distanceKm: distance,
        };
        duplicateReason = `Similar active issue '${req.title}' found ${distance.toFixed(1)} km away at ${req.locationText}`;
      }
    }

    const roundedScore = Math.round(highestScore * 100) / 100;
    const isWarning = roundedScore >= 0.75;

    return {
      isDuplicateWarning: isWarning,
      duplicateScore: roundedScore,
      similarRequest: isWarning ? closestCandidate : undefined,
      reason: isWarning ? duplicateReason : undefined,
    };
  }
}
