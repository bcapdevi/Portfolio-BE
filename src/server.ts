import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { join } from 'path';
import AutoLoad from '@fastify/autoload';

export const createServer = (): FastifyInstance => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  // Register plugins
  server.register(cors, {
    origin: true,
    credentials: true
  });

  // Auto-load routes
  server.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' }
  });

  // Health check route
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return server;
};

export default createServer;