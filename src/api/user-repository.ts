import BaseRepository from '@/api/base-repository.ts'
import { IUser } from '@/types/IUser.ts'

const resource = '/user'

export default {

  getInfoMe() {
    return BaseRepository.get(`${resource}/me`)
  }
}