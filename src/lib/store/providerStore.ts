import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { IGetProviderRequest, IProvider } from '@/types/provider.interface.ts'
import { IIntegratedProvider } from '@/types'
import { find } from 'lodash'
import { providers } from '@/providers/providers.ts'
import { IProviderConfig } from '@/providers/provider.interface.ts'

const ProviderRepository = RepositoryFactory.get('provider')

export interface ProviderState {
  selectedProvider: IIntegratedProvider | undefined,
  setSelectedProvider: (p: IIntegratedProvider | undefined) => void,
  openEdit: {
    open: boolean,
    data: IProvider | undefined
  },
  setOpenEdit: (p: {
    open: boolean,
    data: IProvider | undefined
  }) => void,
  providers: any[];
  providersSelectNode: IProvider[];
  fetchProvider: (payload: IGetProviderRequest) => void;
  fetchProviderNode: (payload: IGetProviderRequest) => void;
}

export const useProvider = create<ProviderState>((set) => ({
  selectedProvider: undefined,
  setSelectedProvider: (p: IIntegratedProvider | undefined) => {
    set({
      selectedProvider: p,
    })
  },
  openEdit: {
    open: false,
    data: undefined,
  },
  setOpenEdit: (p: {
    open: boolean,
    data: IProvider | undefined
  }) => {
    if (p.data) {
      const config: IProviderConfig | undefined = find(providers, e => e.id == p.data?.providerId)

      if (config)
        set({
          selectedProvider: {
            providerId: config.id,
            ...config,
          },
          openEdit: p,
        })
    } else {
      set({
        openEdit: p,
      })
    }
  },
  providers: [],
  providersSelectNode: [],
  fetchProvider: async (payload: IGetProviderRequest) => {
    const rsp = await ProviderRepository.list(payload)

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        providers: rsp.data,
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get provider of project failed',
      })
    }
  },
  fetchProviderNode: async (payload: IGetProviderRequest) => {
    const rsp = await ProviderRepository.list(payload)

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        providersSelectNode: rsp.data,
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get provider of project failed',
      })
    }
  },
}))