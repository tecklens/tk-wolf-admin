import AuthRepository from '@/api/auth-repository.ts'
import { get } from 'lodash'
import UserRepository from '@/api/user-repository.ts'

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
}

export const RepositoryFactory = {
  get: (name: string) => get(repositories, name)
}