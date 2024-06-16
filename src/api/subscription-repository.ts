import BaseRepository from '@/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/sub'

export default {
  all(payload: any) {
    return BaseRepository.get(`${resource}/all`, {
      params: payload,
    })
  },

  del(payload: {
    subscriptionId: string
  }) {
    return BaseRepository.delete(`${resource}/`, {
      params: payload
    })
  },
}