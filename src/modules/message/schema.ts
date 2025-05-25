import { Type, Static } from '@sinclair/typebox'

export const messageSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  email: Type.String({ format: 'email' }),
  message: Type.String({ minLength: 1, maxLength: 1000 })
})

export const messageResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String(),
  message: Type.String(),
  created_at: Type.String({ format: 'date-time' })  // Match database column name
})

export type MessageType = Static<typeof messageSchema>
export type MessageResponseType = Static<typeof messageResponseSchema>