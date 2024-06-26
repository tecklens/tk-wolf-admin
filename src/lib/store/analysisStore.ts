import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { IPageRequest, IPageResponse } from '@/types'

const AnalysisRepository = RepositoryFactory.get('anal')
const TriggerRepository = RepositoryFactory.get('trigger')

export interface IAnalData {
  count: number;
  date: string;
}

export interface AnalysisState {
  logs: IPageResponse<any>;
  trigger: IAnalData[];
  fetchTriggerData: (period: string, event_type: string) => void;
  fetchLogsTrigger: (payload: IPageRequest) => void;
}

export const useAnalysis = create<AnalysisState>((set) => ({
  logs: {
    page: 0,
    data: [],
    pageSize: 0,
    totalCount: 0
  },
  trigger: [],
  fetchTriggerData: async (period: string, event_type: string) => {
    const rsp = await AnalysisRepository.analyse({
      period: period,
      event_type,
    })

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        trigger: rsp.data?.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get Chart call api trigger failed'
      })
    }
  },
  fetchLogsTrigger: async (payload: IPageRequest) => {
    const rsp = await TriggerRepository.logs(payload)

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        logs: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        title: 'Get Logs of Trigger',
        description: 'Get log request trigger of you is failed.',
        variant: 'destructive'
      })
    }
  }
}))