import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const providerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  channel: z.string(),
  active: z.boolean(),
  identifier: z.string(),
  providerId: z.string(),
  credentials: z.any({}),
})

export type ProviderTable = z.infer<typeof providerSchema>
