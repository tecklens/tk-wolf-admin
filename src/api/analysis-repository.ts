import BaseRepository from '@/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/log'

export default {
  analyse(payload: any) {
    return BaseRepository.get(`${resource}/analyse`, {
      params: payload
    })
  },
  dashboard(payload: any) {
    return BaseRepository.get(`${resource}/dashboard`, {
      params: payload
    })
  },
}