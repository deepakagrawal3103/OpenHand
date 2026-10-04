export type RequestType = 'NEED' | 'GIVE' | 'SERVICE' | 'REPORT';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RequestStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'MATCHING'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'ARRIVED'
  | 'PROOF_SUBMITTED'
  | 'AWAITING_VERIFICATION'
  | 'RESOLVED'
  | 'REWORK_REQUESTED'
  | 'CANCELLED';

export type TaskStatus =
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'ARRIVED'
  | 'PROOF_SUBMITTED'
  | 'AWAITING_VERIFICATION'
  | 'RESOLVED'
  | 'REWORK_REQUESTED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'HELPER' | 'ORGANIZATION' | 'ADMIN';
  phone?: string;
  city: string;
  avatar?: string;
  bio?: string;
  trustScore: number;
  entityType?: 'INDIVIDUAL' | 'SKILLED_WORKER' | 'NGO';
  ngoCategory?: string;
  wishlistTags?: string;
  primarySkill?: string;
  visitFee?: number;
  whatsappNotifications?: boolean;
  whatsappNumber?: string;
  availability?: {
    isAvailable: boolean;
    radiusKm: number;
    lat: number;
    lng: number;
  };
  skills?: Array<{
    id: string;
    level: string;
    verified: boolean;
    skill: { id: string; name: string; category: string };
  }>;
}

export interface RequestAI {
  id: string;
  requestId: string;
  modelVersion?: string;
  summary: string;
  categorySuggestion: string;
  urgencySuggestion: string;
  affectedCount: number;
  duplicateScore: number;
  keywords: string;
  confidence: number;
}

export interface CivicRequest {
  id: string;
  creatorId: string;
  type: RequestType;
  status: RequestStatus;
  title: string;
  description: string;
  category: string;
  urgency: UrgencyLevel;
  lat: number;
  lng: number;
  locationText: string;
  affectedCount: number;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  aiAudit?: RequestAI;
  matches?: Match[];
  tasks?: Task[];
  distanceKm?: number;
}

export interface MatchFactorBreakdown {
  skillFit: number;
  distance: number;
  availability: number;
  experience: number;
  trust: number;
}

export interface Match {
  id: string;
  requestId: string;
  helperId: string;
  score: number;
  skillFit: number;
  distance: number;
  availability: number;
  experience: number;
  trust: number;
  distanceKm: number;
  explanation: string;
  status: string;
  createdAt: string;
  helper?: User;
  request?: CivicRequest;
}

export interface Task {
  id: string;
  requestId: string;
  helperId: string;
  status: TaskStatus;
  etaMinutes?: number;
  acceptedAt: string;
  startedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  request?: CivicRequest;
  helper?: User;
  proofs?: Proof[];
  messages?: ChatMessage[];
}

export interface Proof {
  id: string;
  taskId: string;
  type: 'BEFORE' | 'AFTER' | 'GENERAL';
  mediaUrl: string;
  note?: string;
  uploadedAt: string;
}

export interface Verification {
  id: string;
  requestId: string;
  requesterId: string;
  outcome: 'CONFIRMED' | 'REWORK_REQUESTED' | 'DISPUTED';
  comment?: string;
  rating?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  text: string;
  actionType?: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    role: string;
  };
}
