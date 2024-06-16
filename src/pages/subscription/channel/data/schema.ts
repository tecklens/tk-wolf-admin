import { z } from 'zod'
import { ISubscription } from '@/types/subscription.interface.ts'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const subscriptionSchema = z.object({
  _id: z.string(),
  channelId: z.string(),
  _userId: z.string(),
  email: z.string(),
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  locale: z.string(),
  subscribed_at: z.date(),
  createdAt: z.string(),
  createdBy: z.string().optional(),
})

export type Subscription = z.infer<typeof subscriptionSchema> & ISubscription
