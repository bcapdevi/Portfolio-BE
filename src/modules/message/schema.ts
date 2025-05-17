import { Static, Type } from '@sinclair/typebox'

export const messageSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  email: Type.String({ format: 'email' }),
  message: Type.String({ minLength: 1, maxLength: 1000 })
})

export type MessageType = Static<typeof messageSchema>

export const messageResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String(),
  message: Type.String(),
  createdAt: Type.String({ format: 'date-time' })
})

export type MessageResponseType = Static<typeof messageResponseSchema>