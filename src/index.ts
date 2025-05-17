//index.ts
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || 'localhost';

const server: FastifyInstance = Fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: true
});

// Routes
server.get('/', async (request, reply) => {
  return { status: 'ok', message: 'Server is running' };
});

// Server startup
const start = async () => {
  try {
    await server.listen({ port: port, host: host });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();