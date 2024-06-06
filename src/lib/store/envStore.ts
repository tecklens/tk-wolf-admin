import { create } from 'zustand'
import {IEnvironment} from "@/types/environment.interface.ts";
import {RepositoryFactory} from "@/api/repository-factory.ts";
import {HttpStatusCode} from "axios";
import {get} from "lodash";
import {useToastGlobal} from "@/lib/store/toastStore.ts";
import { useUser } from '@/lib/store/userStore.ts'

const EnvironmentRepository = RepositoryFactory.get('env')

export interface EnvState {
  env: IEnvironment | null;
  envs: IEnvironment[] | null;
  apiKey: string | null;
  fetchEnv: () => void;
  fetchAllEnv: () => void;
}

export const useEnv = create<EnvState>((set) => ({
  env: null,
  envs: null,
  apiKey: null,
  fetchEnv: async () => {
    const rsp = await EnvironmentRepository.getMe()
    const rspApiKeys = await EnvironmentRepository.apiKeys()

    if (rsp.status === HttpStatusCode.Ok) {
      const env = rsp.data
      if (env._organizationId) {
        useUser.getState().updateCurrentOrg(env._organizationId)
      }
      set({
        env,
      })
    }

    if (rspApiKeys.status === HttpStatusCode.Ok) {
      set({
        apiKey: get(rspApiKeys.data, [0, 'key'])
      })
    }
  },
  fetchAllEnv: async () => {
    const rsp = await EnvironmentRepository.list()

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        envs: rsp.data,
      })
    } else {
      useToastGlobal.getState().update({
        title: 'Get Environment',
        description: 'Get environment of you is failed. Please log in again',
        variant: 'destructive'
      })
    }
}
}))