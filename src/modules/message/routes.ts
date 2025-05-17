import { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import { Type } from '@sinclair/typebox'
import { messageSchema, messageResponseSchema, MessageType, MessageResponseType } from './schema'

// In-memory storage for demo purposes
// In production, use a proper database
const messages: MessageResponseType[] = []

export default async function messageRoutes(fastify: FastifyInstance) {
  // Create a new message
  fastify.post<{ Body: MessageType }>('/messages', {
    schema: {
      body: messageSchema,
      response: {
        201: messageResponseSchema
      }
    },
    handler: async (request, reply) => {
      const { name, email, message } = request.body
      const newMessage: MessageResponseType = {
        id: uuidv4(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      }
      messages.push(newMessage)
      return reply.code(201).send(newMessage)
    }
  })

  // Get all messages
  fastify.get('/messages', {
    schema: {
      response: {
        200: Type.Array(messageResponseSchema)
      }
    },
    handler: async () => {
      return messages
    }
  })

  // Get a specific message by ID
  fastify.get<{ Params: { id: string } }>('/messages/:id', {
    schema: {
      params: Type.Object({
        id: Type.String({ format: 'uuid' })
      }),
      response: {
        200: messageResponseSchema
      }
    },
    handler: async (request, reply) => {
      const message = messages.find(m => m.id === request.params.id)
      if (!message) {
        return reply.code(404).send({ error: 'Message not found' })
      }
      return message
    }
  })
}