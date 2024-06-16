import { create } from 'zustand'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { IPageRequest, IPageResponse } from '@/types'
import { ISubscription } from '@/types/subscription.interface.ts'

const SubscriptionRepository = RepositoryFactory.get('sub')

export interface SubscriptionState {
  subscriptions: IPageResponse<ISubscription>;
  fetchAllSubscriptions: ({ page, limit }: IPageRequest) => void;
}

export const useSubscription = create<SubscriptionState>((set) => ({
  subscriptions: {
    page: 0,
    data: [],
    pageSize: 0,
    total: 0,
  },
  fetchAllSubscriptions: async ({ page, limit }: IPageRequest) => {
    const rsp = await SubscriptionRepository.all({
      page,
      limit,
    })

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        subscriptions: {
          ...(rsp.data ?? {}),
          page: page,
          pageSize: limit
        },
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get subscription failed',
      })
    }
  },
}))