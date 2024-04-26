import { create } from 'zustand'
import { IWorkflowEntity } from '@/types/workflow.interface.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useUser } from '@/lib/store/userStore.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'

const WorkflowRepository = RepositoryFactory.get('wf')

export interface WorkflowState {
  workflow: IWorkflowEntity | null;
  workflows: IWorkflowEntity[] | null;
  select: (wf: string) => any;
  fetchWf: () => void,
  create: (name: string) => Promise<boolean>,
  reload: () => void
}

export const useWorkflow = create<WorkflowState>((set, getState) => ({
  workflow: null,
  workflows: null,
  select: async (wf) => {
    const rsp = await WorkflowRepository.setActive({workflowId: wf})
    if (rsp.status === HttpStatusCode.Ok) {
      const rspActiveRetry = await WorkflowRepository.getActive()
      set({
        workflow: rspActiveRetry.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Select Workflow is failed',
      })
    }
  },
  fetchWf: async () => {
    if (useUser.getState().token) {
      const rsp = await WorkflowRepository.list()
      const rspActive = await WorkflowRepository.getActive()

      if (rsp.status === HttpStatusCode.Ok && rspActive.status === HttpStatusCode.Ok) {
        set({
          workflows: rsp.data?.data,
          workflow: rspActive.data,
        })

        if (!rspActive.data && rsp.data?.data?.length > 0) {
          await WorkflowRepository.setActive({workflowId: rsp.data?.data[0]._id})

          const rspActiveRetry = await WorkflowRepository.getActive()
          set({
            workflow: rspActiveRetry.data
          })
        }
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'Get List Workflow is failed',
        })
      }
    }
  },
  create: async (name: string) => {
    const rsp = await WorkflowRepository.create({ name })

    if (rsp.status === HttpStatusCode.Created) {
      getState().fetchWf()
      return true
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Create Workflow is failed',
      })

      return false
    }
  },
  reload: async () => {
    const rspActiveRetry = await WorkflowRepository.getActive()
    set({
      workflow: rspActiveRetry.data
    })
  }
}))