import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocketIO(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  io.on('connection', (socket: Socket) => {
    // Join User Room for direct notifications
    socket.on('join:user', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join Task Room for live chat and task lifecycle transitions
    socket.on('join:task', (taskId: string) => {
      if (taskId) {
        socket.join(`task:${taskId}`);
      }
    });

    // Join Live Radar Feed Room for public counters & live activity
    socket.on('join:live', () => {
      socket.join('live:feed');
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

// Event Emitters matching TRD Section 11.2
export function emitTaskUpdated(taskId: string, payload: any) {
  if (!io) return;
  io.to(`task:${taskId}`).emit('task:updated', payload);
  if (payload.helperId) io.to(`user:${payload.helperId}`).emit('task:updated', payload);
  if (payload.requesterId) io.to(`user:${payload.requesterId}`).emit('task:updated', payload);
}

export function emitMessageNew(taskId: string, message: any) {
  if (!io) return;
  io.to(`task:${taskId}`).emit('message:new', message);
}

export function emitProofSubmitted(taskId: string, proofData: any) {
  if (!io) return;
  io.to(`task:${taskId}`).emit('proof:submitted', proofData);
}

export function emitVerificationUpdated(taskId: string, verificationData: any) {
  if (!io) return;
  io.to(`task:${taskId}`).emit('verification:updated', verificationData);
}

export function emitLiveRequestCreated(request: any) {
  if (!io) return;
  io.to('live:feed').emit('live:request_created', request);
}

export function emitNotificationNew(userId: string, notification: any) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', notification);
}
