import { create } from 'zustand'
import { IVariable, IWorkflowEntity } from '@/types/workflow.interface.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useUser } from '@/lib/store/userStore.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { ChannelTypeEnum } from '@/types/channel'

const WorkflowRepository = RepositoryFactory.get('wf')

interface ISelectProvider {
  open: boolean;
  channel: ChannelTypeEnum | null;
  nodeId: string | null;
}

export interface WorkflowState {
  workflow: IWorkflowEntity | null;
  workflows: IWorkflowEntity[] | null;
  selectingProvider: ISelectProvider;
  variables: IVariable[],

  openModalProvider: ({
                        open,
                        channel,
                        nodeId,
                      }: ISelectProvider) => void;
  select: (wf: string) => any;
  fetchWf: () => void,
  fetchVariable: () => void,
  create: (name: string) => Promise<boolean>,
  reload: () => void,
  openEditVariable: boolean,
  setOpenEditVariable: (val: boolean) => void
}

export const useWorkflow = create<WorkflowState>((set, getState) => ({
  workflow: null,
  workflows: null,
  variables: [],
  selectingProvider: {
    open: false,
    nodeId: null,
    channel: null,
  },
  openModalProvider: (d: ISelectProvider) => set({ selectingProvider: d }),
  select: async (wf) => {
    const rsp = await WorkflowRepository.setActive({ workflowId: wf })
    if (rsp.status === HttpStatusCode.Ok) {
      const rspActiveRetry = await WorkflowRepository.getActive()
      set({
        workflow: rspActiveRetry.data,
      })

      if (rspActiveRetry.data) {
        WorkflowRepository.variables(rspActiveRetry.data._id).then((rep: any) => {
          set({
            variables: rep.data,
          })
        })
      }
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
          await WorkflowRepository.setActive({ workflowId: rsp.data?.data[0]._id })

          const rspActiveRetry = await WorkflowRepository.getActive()
          set({
            workflow: rspActiveRetry.data,
          })
          if (rspActiveRetry.data) {
            WorkflowRepository.variables(rspActiveRetry.data._id).then((rep: any) => {
              set({
                variables: rep.data,
              })
            })
          }
        } else {
          if (rspActive.data)
            WorkflowRepository.variables(rspActive.data._id).then((rep: any) => {
              set({
                variables: rep.data,
              })
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
  fetchVariable: async () => {
    if (!getState().workflow) return
    WorkflowRepository.variables(getState().workflow?._id).then((rep: any) => {
      set({
        variables: rep.data,
      })
    }).catch((_: any) => {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get Variable of Workflow is failed',
      })
    })
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
      workflow: rspActiveRetry.data,
    })
  },
  openEditVariable: false,
  setOpenEditVariable: (val: boolean) => set({ openEditVariable: val }),
}))