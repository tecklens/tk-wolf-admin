import AuthRepository from '@/api/auth-repository.ts'
import { get } from 'lodash'
import UserRepository from '@/api/user-repository.ts'
import EnvironmentRepository from '@/api/environment-repository.ts'
import WorkflowRepository from '@/api/workflow-repository.ts'
import OrgRepository from '@/api/org-repository.ts'
import ProviderRepository from '@/api/provider-repository.ts'
import TriggerRepository from '@/api/trigger-repository.ts'
import AnalysisRepository from '@/api/analysis-repository.ts'
import NotificationRepository from '@/api/notification-repository.ts'
import SubscriptionRepository from '@/api/subscription-repository.ts'
import FileRepository from '@/api/file-repository.ts'

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  env: EnvironmentRepository,
  wf: WorkflowRepository,
  org: OrgRepository,
  provider: ProviderRepository,
  trigger: TriggerRepository,
  anal: AnalysisRepository,
  noti: NotificationRepository,
  sub: SubscriptionRepository,
  file: FileRepository,
}

export const RepositoryFactory: {
  get: (name: 'auth' | 'user' | 'env' | 'wf' | 'org' | 'provider' | 'trigger' | 'anal' | 'noti' | 'sub' | 'file') => any
} = {
  get: (name: 'auth' | 'user' | 'env' | 'wf' | 'org' | 'provider' | 'trigger' | 'anal' | 'noti' | 'sub' | 'file') => get(repositories, name)
}