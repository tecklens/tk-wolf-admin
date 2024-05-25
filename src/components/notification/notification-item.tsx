import { motion, useIsPresent } from 'framer-motion'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { INotification } from '@/types/notification.interface.ts'
import { throttle } from 'lodash'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const NotificationRepository = RepositoryFactory.get('noti')

export interface INotificationItemProps {
  data: INotification,
  onClick: () => void,
  theme: string | undefined;
}

export const NotificationItem = ({data, onClick, theme}: INotificationItemProps) => {
  const isPresent = useIsPresent()

  const mark = throttle(() => {
    NotificationRepository.mark(data._id)
  }, 200)

  const animations = {
    styles: {
      position: isPresent ? 'static' : 'absolute'
    },
    initial: {scale: 0, opacity: 0},
    exit: {scale: 0, opacity: 0},
    animate: {scale: 1, opacity: 1},
    transition: {type: 'spring', stiffness: 900, damping: 40}
  }

  return (
    <motion.div {...animations} layout onClick={onClick} className={'relative overflow-hidden'}>
      <div className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} rounded`} onClick={mark}>
        <div className={'text-sm font-semibold'}>{data.payload.title}</div>
        <div className={'text-xs'}>{data.payload.description}</div>
        <div className={'text-xs text-slate-600'}>{formatDistanceToNow(new Date(data.createdAt), {addSuffix: true})}</div>
      </div>

      {!data.marked
        ? <div className={'absolute left-0 top-0 w-1 bg-green-700 h-full rounded-l'}>

      </div>
      : null}
    </motion.div>
  )
}