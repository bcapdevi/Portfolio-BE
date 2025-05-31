import { Message } from '../models/message'

declare global {
  type MessageAttributes = Message
}