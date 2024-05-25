import BaseRepository from '@/api/base-repository.ts'
import {Node as NodeFlow, Edge as EdgeFlow} from 'reactflow'
import { IUpdateWorkflow, IVariable, IWorkflowEntity } from '@/types/workflow.interface.ts'

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
  getOneNode(payload: string) {
    return BaseRepository.get(`${resource}/node/${payload}`)
  },
  addNode(payload: NodeFlow<any, any> & {workflowId: string}) {
    return BaseRepository.post(`${resource}/node`, payload)
  },
  updateNode(payload: any) {
    return BaseRepository.put(`${resource}/node`, payload)
  },
  setProviderNode(payload: any) {
    return BaseRepository.post(`${resource}/node/provider`, payload)
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
  listEmailTemplate(payload: any) {
    return BaseRepository.get(`${resource}/email/templates`, {
      params: payload
    })
  },
  variables(wfId: number) {
    return BaseRepository.get(`${resource}/variable/${wfId}`, )
  },
  changeVariables(variables: IVariable[]) {
    return BaseRepository.post(`${resource}/variable`, variables)
  },
  createEmailTemplate(payload: any) {
    return BaseRepository.post(`${resource}/email/template`, payload)
  },
}