import BaseRepository from '@/api/base-repository.ts'
import { ICreateProviderBodyDto, IGetProviderRequest } from '@/types/provider.interface.ts'

const resource = '/provider'

export default {
  create(payload: ICreateProviderBodyDto) {
    return BaseRepository.post(`${resource}/`, payload)
  },
  update(id: string, payload: ICreateProviderBodyDto) {
    return BaseRepository.put(`${resource}/${id}`, payload)
  },
  list(payload: IGetProviderRequest) {
    return BaseRepository.get(`${resource}/`, { params: payload })
  },
  connected() {
    return BaseRepository.get(`${resource}/connected`)
  },
}