import { FastifyInstance } from 'fastify'
import Message from '../../models/message'
import { messageSchema, messageResponseSchema } from './schema'
import { createLogger } from '../../utils/logger'

const logger = createLogger('message-routes')

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
      try {
        const message = await Message.create(request.body as any)

        // Send notification email
        await fastify.mailer.sendMail({
          from: process.env.GMAIL_ADDRESS,
          to: process.env.NOTIFICATION_EMAIL,
          subject: 'New Portfolio Message',
          html: `
            <h2>New Message from Portfolio</h2>
            <p><strong>From:</strong> ${message.name} (${message.email})</p>
            <p><strong>Message:</strong></p>
            <p>${message.message}</p>
            <p><small>Sent at: ${message.created_at}</small></p>
          `
        })

        logger.info('Email notification sent for message:', { messageId: message.id })
        return reply.code(201).send(message)
      } catch (error) {
        logger.error('Failed to process message:', error)
        return reply.code(500).send({ 
          error: 'Failed to process message' 
        })
      }
    }
  })

  // Get all messages
  fastify.get('/messages', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: messageResponseSchema
        }
      }
    },
    handler: async (request, reply) => {
      const messages = await Message.findAll({
        order: [['created_at', 'DESC']]
      })
      return reply.send(messages)
    }
  })
}