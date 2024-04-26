import BaseRepository from '@/api/base-repository.ts'
import {Node as NodeFlow, Edge as EdgeFlow} from 'reactflow'
import {IUpdateWorkflow, IWorkflowEntity} from '@/types/workflow.interface.ts'

const resource = '/wf'

export default {
  create(payload: IWorkflowEntity) {
    return BaseRepository.post(`${resource}/`, payload)
  },
  update(payload: IUpdateWorkflow) {
    return BaseRepository.put(`${resource}/`, payload)
  },
  list() {
    return BaseRepository.get(`${resource}/`)
  },
  detail(wfId: string) {
    return BaseRepository.get(`${resource}/detail/${wfId}`)
  },
  addNode(payload: NodeFlow<any, any> & {workflowId: string}) {
    return BaseRepository.post(`${resource}/node`, payload)
  },
  updateNode(payload: NodeFlow<any, any>[]) {
    return BaseRepository.put(`${resource}/node`, payload)
  },
  addEdge(payload: EdgeFlow<any>) {
    return BaseRepository.post(`${resource}/edge`, payload)
  },
  getActive() {
    return BaseRepository.get(`${resource}/active`)
  },
  setActive(payload: {workflowId: string}) {
    return BaseRepository.put(`${resource}/active`, payload)
  },
  delEle(payload: any) {
    return BaseRepository.post(`${resource}/node/del`, payload)
  },
}