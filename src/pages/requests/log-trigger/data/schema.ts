import { z } from 'zod'
import { TaskStatus } from '@/types/task.interface.ts'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const logTriggerSchema = z.object({
  _id: z.string(),
  event_type: z.string(),
  _userId: z.string(),
  _environmentId: z.string(),
  _organizationId: z.string(),
  _workflowId: z.string(),
  workflowName: z.string(),
  recipient: z.string(),
  status: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
})

export type LogTrigger = z.infer<typeof logTriggerSchema>
