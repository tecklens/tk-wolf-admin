import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { IGetProviderRequest, IProvider } from '@/types/provider.interface.ts'
const ProviderRepository = RepositoryFactory.get('provider')

export interface ProviderState {
  providers: any[];
  providersSelectNode: IProvider[];
  fetchProvider: (payload: IGetProviderRequest) => void;
  fetchProviderNode: (payload: IGetProviderRequest) => void;
}

export const useProvider = create<ProviderState>((set) => ({
  providers: [],
  providersSelectNode: [],
  fetchProvider: async (payload: IGetProviderRequest) => {
    const rsp = await ProviderRepository.list(payload);

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        providers: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get provider of project failed'
      })
    }
  },
  fetchProviderNode: async (payload: IGetProviderRequest) => {
    const rsp = await ProviderRepository.list(payload);

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        providersSelectNode: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get provider of project failed'
      })
    }
  }
}))