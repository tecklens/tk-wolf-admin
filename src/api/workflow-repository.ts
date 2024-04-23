import BaseRepository from '@/api/base-repository.ts'
import {Node as NodeFlow} from 'reactflow'

const resource = '/wf'

export default {
  list() {
    return BaseRepository.get(`${resource}/`)
  },
  addNode(payload: NodeFlow<any, any>) {
    return BaseRepository.post(`${resource}/node`, payload)
  },
  getActive() {
    return BaseRepository.get(`${resource}/active`)
  },
  setActive(payload: {worflowId: string}) {
    return BaseRepository.put(`${resource}/active`, payload)
  },
}