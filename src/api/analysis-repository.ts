import BaseRepository from '@/api/base-repository.ts'

const resource = '/log'

export default {
  analyse(payload: any) {
    return BaseRepository.get(`${resource}/analyse`, {
      params: payload
    })
  },
  analyseTaskError(payload: any) {
    return BaseRepository.get(`${resource}/analyse/task-error`, {
      params: payload
    })
  },
  dashboard(payload: any) {
    return BaseRepository.get(`${resource}/dashboard`, {
      params: payload
    })
  },
}