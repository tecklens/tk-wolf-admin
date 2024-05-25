import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { ITask } from '@/types/task.interface.ts'

const TriggerRepository = RepositoryFactory.get('trigger')

export interface TaskState {
  tasks: {
    page: number,
    pageSize: number,
    totalCount: number,
    data: any[]
  };
  fetchTask: (payload: any) => void;
  errorDetail: any | undefined;
  showError: (e: any) => void;
}

export const useTask = create<TaskState>((set) => ({
  errorDetail: undefined,
  showError: (e: any) => set({errorDetail: e}),
  tasks: {
    page: 0,
    pageSize: 10,
    totalCount: 0,
    data: []
  },
  fetchTask: async (payload) => {
    const rsp = await TriggerRepository.listTask(payload)

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        tasks: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        title: 'Get Task',
        description: 'Get task of you is failed.',
        variant: 'destructive'
      })
    }
  },
}))