import React from 'react'
import { NotificationContainer } from '@/components/notification/notification-container.tsx'
import { IWolfNotificationProps } from '@/types/notification.interface.ts'
import { IconBellRinging } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import EventProvider from '@/context/event.tsx'

export function NotificationNav(props: IWolfNotificationProps) {
  return (
    <EventProvider>
      <Popover>
        <PopoverTrigger asChild>
          <IconBellRinging size={20} />
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 mt-3 md:mr-3">
          <NotificationContainer {...props} />
        </PopoverContent>
      </Popover>
    </EventProvider>

  )
}