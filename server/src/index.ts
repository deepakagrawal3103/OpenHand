import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prisma/client';
import { initSocketIO } from './socket';

import authRoutes from './modules/auth/auth.routes';
import requestRoutes from './modules/requests/requests.routes';
import taskRoutes from './modules/tasks/tasks.routes';
import matchesRoutes from './modules/matching/matches.routes';
import aiRoutes from './modules/ai/ai.routes';
import helperRoutes from './modules/helpers/helpers.routes';
import liveRoutes from './modules/live/live.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoints (TRD Section 18.4)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/health/db', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'connected', database: 'ready' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/live', liveRoutes);

// Error normalization middleware (TRD Section 4.3)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      requestId: req.headers['x-request-id'] || undefined,
    },
    meta: {},
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 OpenHand API Server running on port ${PORT}`);
  console.log(`📡 Socket.IO Realtime engine active`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
});

export { app, server };
