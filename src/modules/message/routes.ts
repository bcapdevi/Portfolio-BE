import { FastifyInstance } from 'fastify'
import Message from '../../models/message'
import { messageSchema, messageResponseSchema } from './schema'


export default async function messageRoutes(fastify: FastifyInstance) {
  // Create a new message
  fastify.post('/messages', {
    schema: {
      body: messageSchema,
      response: {
        201: messageResponseSchema
      }
    },
    handler: async (request, reply) => {
      const message = await Message.create(request.body as any)
      return reply.code(201).send(message)
    }
  })
}