import { create } from 'zustand'
import {IEnvironment} from "@/types/environment.interface.ts";
import {RepositoryFactory} from "@/api/repository-factory.ts";
import {HttpStatusCode} from "axios";
import {get} from "lodash";
import {useToastGlobal} from "@/lib/store/toastStore.ts";

const AnalysisRepository = RepositoryFactory.get('anal')

export interface IAnalData {
  count: number;
  date: string;
}

export interface AnalysisState {
  trigger: IAnalData[];
  fetchTriggerData: (period: string, event_type: string) => void
}

export const useAnalysis = create<AnalysisState>((set) => ({
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
}))