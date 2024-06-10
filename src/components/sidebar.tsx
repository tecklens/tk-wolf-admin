import React, { useEffect, useState } from 'react'
import { IconBike, IconChevronsLeft, IconCircle, IconMenu2, IconX } from '@tabler/icons-react'
import { Layout, LayoutHeader } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { sidelinks } from '@/data/sidelinks'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { useEnv } from '@/lib/store/envStore.ts'
import { useUser } from '@/lib/store/userStore.ts'
import { throttle } from 'lodash'
import { Link } from 'react-router-dom'
import SidebarTour from '@/components/sidebar-tour.tsx'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar2({
                                   className,
                                   isCollapsed,
                                   setIsCollapsed,
                                 }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { env, envs } = useEnv(state => state)
  const switchEnv = useUser(state => state.switchEnv)
  const { fetchOrg, organizations, currentOrg } = useUser(state => state)

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    fetchOrg()
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  const switchEnvThrottle = throttle(switchEnv, 100)

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`}
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <span className="sr-only">Website Name</span>
            </svg>
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className="font-medium">WOLF</span>
              <span className="text-xs">Notification Flow</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </LayoutHeader>
        {isCollapsed ? null : <div className={'p-3'}>
          <Select value={currentOrg}>
            <SelectTrigger className="w-full org-switcher">
              <SelectValue placeholder="Select a organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{organizations.find(e => e._id === currentOrg)?.name}</SelectLabel>
                {organizations.map(e => (
                  <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>}
        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />
        <Link to={'/get-started'} className={`${isCollapsed || !envs ? 'hidden' : 'block'}`}>
          <div
            className={'flex space-x-1 py-2 px-3 items-center cursor-pointer hover:text-green-600 w-full'}
          >
            <IconBike size={18} />
            <div className={'text-sm flex-1'}>Get Started</div>
            <div className={'flex space-x-1 text-green-700 dark:text-green-500'}>
              <IconCircle size={8} />
              <IconCircle size={8} />
              <IconCircle size={8} />
              <IconCircle size={8} />
            </div>
          </div>
        </Link>
        <Tabs value={env?._id} onValueChange={switchEnvThrottle}
              className={`w-full p-2 ${isCollapsed || !envs ? 'hidden' : 'block'}`}>
          <TabsList className="env-switcher grid w-full grid-cols-2">
            {envs ? envs.map(e => (
                <TabsTrigger value={e._id} key={e._id}>{e.name} MODE</TabsTrigger>
              ))
              : null
            }
          </TabsList>
        </Tabs>

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
      <SidebarTour onOpenCollapse={() => setIsCollapsed(false)}/>
    </aside>
  )
}
