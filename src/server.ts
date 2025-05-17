import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import messageRoutes from './modules/message/routes';

export const createServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      } : undefined
    }
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || true
  });

  // Register message routes
  await server.register(messageRoutes, { prefix: '/api' });

  // Register base routes
  server.route({
    method: 'GET',
    url: '/',
    handler: async () => {
      return { status: 'ok', message: 'Server is running' };
    }
  });

  server.route({
    method: 'GET',
    url: '/health',
    handler: async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'portfolio-backend',
        uptime: process.uptime()
      };
    }
  });

  return server;
};

export default createServer;