import BaseRepository from '@/api/base-repository.ts'
import { IGetProviderRequest, ICreateProviderBodyDto, IProvider } from '@/types/provider.interface.ts'

const resource = '/provider'

export default {
  create(payload: ICreateProviderBodyDto) {
    return BaseRepository.post(`${resource}/`, payload)
  },
  list(payload: IGetProviderRequest) {
    return BaseRepository.get(`${resource}/`, { params: payload })
  },
}