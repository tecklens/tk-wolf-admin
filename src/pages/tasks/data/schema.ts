import { z } from 'zod'
import { TaskStatus } from '@/types/task.interface.ts'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  _workflowId: z.string(),
  workflowName: z.string(),
  _nodeId: z.string(),
  _providerId: z.string(),
  providerName: z.string(),
  channel: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  priority: z.string(),
  email: z.string(),
  status: z.nativeEnum(TaskStatus),
  createdAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>
