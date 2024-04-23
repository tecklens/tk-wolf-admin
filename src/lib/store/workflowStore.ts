import { create } from 'zustand'
import {IWorkflowEntity} from "@/types/workflow.interface.ts";
import {RepositoryFactory} from "@/api/repository-factory.ts";
import {useUser} from "@/lib/store/userStore.ts";
import {HttpStatusCode} from "axios";
import {useToastGlobal} from "@/lib/store/toastStore.ts";

const WorkflowRepository = RepositoryFactory.get('wf')

export interface WorkflowState {
  workflow: IWorkflowEntity | null;
  workflows: IWorkflowEntity[] | null;
  select: (wf: IWorkflowEntity) => any;
  fetchWf: () => void
}

export const useWorkflow = create<WorkflowState>((set) => ({
  workflow: null,
  workflows: null,
  select: (wf) => {
    set({
      workflow: wf
    })
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
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'Get List Workflow is failed'
        })
      }
    }
  }
}))