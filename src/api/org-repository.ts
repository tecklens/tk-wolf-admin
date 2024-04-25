import BaseRepository from '@/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/org'

export default {
  members() {
    return BaseRepository.get(`${resource}/members`)
  },
}