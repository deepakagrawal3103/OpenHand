import { prisma } from '../../prisma/client';
import { calculateDistanceScore, calculateHaversineDistance } from '../../utils/geo';

export interface MatchFactorBreakdown {
  score: number;
  factors: {
    skillFit: number;
    distance: number;
    availability: number;
    experience: number;
    trust: number;
  };
  distanceKm: number;
  reason: string;
}

export class MatchingService {
  /**
   * Generates or recalculates matches for a request against eligible nearby helpers
   */
  static async matchHelpersForRequest(requestId: string): Promise<any[]> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { creator: true },
    });

    if (!request) throw new Error('Request not found');

    // Find all users with HELPER role
    const helpers = await prisma.user.findMany({
      where: {
        role: { in: ['HELPER', 'ORGANIZATION'] },
        id: { not: request.creatorId }, // Can't match creator
      },
      include: {
        availability: true,
        skills: {
          include: { skill: true },
        },
        tasks: {
          where: { status: 'RESOLVED' },
        },
      },
    });

    const matchesCreated = [];

    for (const helper of helpers) {
      // 1. Calculate Distance
      const helperLat = helper.availability?.lat || 22.7210;
      const helperLng = helper.availability?.lng || 75.8590;
      const distanceKm = calculateHaversineDistance(request.lat, request.lng, helperLat, helperLng);

      const maxRadius = helper.availability?.radiusKm || 5.0;
      const distanceScore = calculateDistanceScore(distanceKm, maxRadius);

      // 2. Calculate Skill Fit (0 - 100)
      let skillFitScore = 50; // base fit
      const helperSkillNames = helper.skills.map((s) => s.skill.name.toLowerCase());
      const helperSkillCategories = helper.skills.map((s) => s.skill.category.toLowerCase());

      const reqCategory = request.category.toLowerCase();
      const reqText = `${request.title} ${request.description}`.toLowerCase();

      let hasExactSkillMatch = false;
      for (const skillName of helperSkillNames) {
        if (reqText.includes(skillName.split(' ')[0])) {
          hasExactSkillMatch = true;
          break;
        }
      }

      if (hasExactSkillMatch) {
        skillFitScore = 96;
      } else if (
        (reqCategory.includes('hardware') && helperSkillCategories.includes('hardware')) ||
        (reqCategory.includes('electrical') && helperSkillCategories.includes('electrical')) ||
        (reqCategory.includes('tools') && helperSkillCategories.includes('tools'))
      ) {
        skillFitScore = 88;
      } else if (helper.skills.length > 0) {
        skillFitScore = 65;
      }

      // 3. Availability Score (0 - 100)
      const isAvailable = helper.availability?.isAvailable ?? true;
      const availabilityScore = isAvailable ? 100 : 20;

      // 4. Experience Score (0 - 100)
      const completedTasksCount = helper.tasks.length;
      let experienceScore = Math.min(100, 50 + completedTasksCount * 4);
      if (completedTasksCount >= 10) experienceScore = Math.min(100, 80 + completedTasksCount);

      // 5. Trust Score (0 - 100)
      const trustScore = helper.trustScore || 85;

      // 6. TRD Multi-factor Formula:
      // Score = 0.35 SkillFit + 0.25 DistanceScore + 0.15 AvailabilityScore + 0.15 ExperienceScore + 0.10 TrustScore
      const totalScore = Math.round(
        0.35 * skillFitScore +
        0.25 * distanceScore +
        0.15 * availabilityScore +
        0.15 * experienceScore +
        0.10 * trustScore
      );

      // Human-readable explainability reason
      const reasonParts: string[] = [];
      if (skillFitScore >= 85) reasonParts.push('Strong domain skills');
      else if (skillFitScore >= 70) reasonParts.push('Relevant skills');
      reasonParts.push(`${distanceKm} km away`);
      if (isAvailable) reasonParts.push('Available now');
      if (completedTasksCount > 0) reasonParts.push(`${completedTasksCount} completed tasks`);
      if (trustScore >= 90) reasonParts.push('Trusted profile');

      const explanation = reasonParts.join(' • ');

      // Upsert Match in Database
      const match = await prisma.match.upsert({
        where: {
          requestId_helperId: {
            requestId: request.id,
            helperId: helper.id,
          },
        },
        update: {
          score: totalScore,
          skillFit: skillFitScore,
          distance: distanceScore,
          availability: availabilityScore,
          experience: experienceScore,
          trust: trustScore,
          distanceKm,
          explanation,
        },
        create: {
          requestId: request.id,
          helperId: helper.id,
          score: totalScore,
          skillFit: skillFitScore,
          distance: distanceScore,
          availability: availabilityScore,
          experience: experienceScore,
          trust: trustScore,
          distanceKm,
          explanation,
          status: 'SUGGESTED',
        },
        include: {
          helper: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              trustScore: true,
              city: true,
              bio: true,
            },
          },
        },
      });

      matchesCreated.push(match);
    }

    // Sort by score descending
    return matchesCreated.sort((a, b) => b.score - a.score);
  }
}
