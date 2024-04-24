import AuthRepository from '@/api/auth-repository.ts'
import { get } from 'lodash'
import UserRepository from '@/api/user-repository.ts'
import EnvironmentRepository from "@/api/environment-repository.ts";
import WorkflowRepository from "@/api/workflow-repository.ts";

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  env: EnvironmentRepository,
  wf: WorkflowRepository
}

export const RepositoryFactory = {
  get: (name: string) => get(repositories, name)
}