import { create } from 'zustand'
import { IEnvironment } from '@/types/environment.interface.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { get, keyBy, merge, slice, values } from 'lodash'
import { useToastGlobal } from '@/lib/store/toastStore.ts'
import { INotification } from '@/types/notification.interface.ts'

const NotificationRepository = RepositoryFactory.get('noti')

export interface NotiState {
  notifications: INotification[];
  total: number | 0;
  fetchNoti: () => void,
  addNoti: (payload: INotification) => void,
}

export const useNoti = create<NotiState>((set, getState) => ({
  notifications: [],
  total: 0,
  fetchNoti: async () => {
    const rsp = await NotificationRepository.list(0, 5)

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        notifications: rsp.data?.data,
        total: rsp.data?.total,
      })
    }
  },
  addNoti: (payload: INotification) => {
    const notis = getState().notifications
    const merged = merge(keyBy([payload], '_id'), keyBy(notis, '_id'));
    const val = values(merged);

    let total = getState().total
    if (val.length > notis.length) total += 1
    set({
      notifications: slice(val, 0, 5),
      total: total,
    })
  }
}))