import React, { memo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { IWolfNotificationProps } from '@/types/notification.interface'
import { NotificationItem } from '@/components/notification/notification-item.tsx'
import { IconSettings, IconSettings2 } from '@tabler/icons-react'
import { WsStatus } from '@/components/notification/ws-status.tsx'
import { useNoti } from '@/lib/store/notiStore.ts'
import { reduce, throttle } from 'lodash'
import useWs from '@/hooks/useWs.ts'
import { nFormatter } from '@/utils'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const NotificationRepository = RepositoryFactory.get('noti')
export const NotificationContainer = memo((props: IWolfNotificationProps) => {
  const { notifications, total, fetchNoti, addNoti } = useNoti()
  const {msg} = useWs()

  const allowMarkAll = reduce(notifications, (rlt, e) => rlt || (!e.marked), false)

  const markAll = throttle(() => {
    NotificationRepository.markAll()
  }, 200)

  useEffect(() => {
    throttle(() => {
      fetchNoti()
    }, 200, { trailing: true })()
  }, [])

  useEffect(() => {
    if (msg?.event === 'notification') {
      addNoti(JSON.parse(msg.data))
    }
  }, [addNoti, msg])

  return (
    <div
      className={`rounded-lg ${props.theme === 'dark' ? 'shadow-dark' : 'shadow-lg'} min-h-[360px] p-2 md:p-3 flex flex-col space-y-2`}>
      <div className={'flex justify-between text-sm'}>
        <div className={'inline-flex space-x-1'}>
          <span className={'font-bold'}>Notifications</span>
          <div
            className={'bg-green-500 h-4 w-4 rounded-full flex items-center justify-center text-[10px] text-white'}>
            {nFormatter(total, 0)}
          </div>
        </div>

        <div className={'inline-flex space-x-2 items-center whitespace-nowrap cursor-pointer active:opacity-80'}>
          <span className={`${allowMarkAll ? '' : 'text-gray-200'}`} onClick={markAll}>Mark all as read</span>
          <IconSettings size={15} />
          <WsStatus />
        </div>
      </div>
      <div className={'w-full flex-1 flex flex-col space-y-2'}>
        <AnimatePresence>
          {notifications?.map(e => (
            <NotificationItem theme={props.theme} key={e._id} data={e} onClick={() => {
              console.log('click')
            }} />
          ))}
        </AnimatePresence>
      </div>
      <div className={'pt-2 w-full text-center text-xs'}>Powed by <span>Wolf</span></div>
    </div>
  )
})
