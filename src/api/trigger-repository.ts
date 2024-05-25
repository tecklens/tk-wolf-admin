import BaseRepository from '@/api/base-repository.ts'
import { IGetProviderRequest, ICreateProviderBodyDto, IProvider } from '@/types/provider.interface.ts'

const resource = '/trigger'

export default {
  listTask(payload: any) {
    return BaseRepository.get(`${resource}/task`, { params: payload })
  },
  delTask(id: string) {
    return BaseRepository.delete(`${resource}/task/${id}`)
  },
}