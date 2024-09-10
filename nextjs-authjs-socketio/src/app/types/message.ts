import { z } from 'zod';

// * Message Schema
export const messageSchema = z.object({
  content: z.string({ required_error: 'Message is required' }),
});
export type TMessageSchema = z.infer<typeof messageSchema>;
