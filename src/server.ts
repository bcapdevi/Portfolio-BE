import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import messageRoutes from './modules/message/routes';
import nodemailerPlugin from './plugins/nodemailer';

export async function createServer() {
  try {
    const server = Fastify({
      logger: true
    })

    // Register plugins
    await server.register(cors, {
      origin: process.env.CORS_ORIGIN || true
    });
    await server.register(nodemailerPlugin);

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

    return server
  } catch (error) {
    console.error('Failed to create server:', error)
    process.exit(1)
  }
}

export default createServer;