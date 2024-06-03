import BaseRepository from '@/api/base-repository.ts'
import { IPageRequest } from '@/types'

const resource = '/trigger'

export default {
  listTask(payload: any) {
    return BaseRepository.get(`${resource}/task`, { params: payload })
  },
  delTask(id: string) {
    return BaseRepository.delete(`${resource}/task/${id}`)
  },
  logs(payload: IPageRequest) {
    return BaseRepository.get(`${resource}/logs`, { params: payload })
  },
  delLog(id: string) {
    return BaseRepository.delete(`${resource}/log/${id}`)
  },
}