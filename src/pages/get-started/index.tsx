import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { TopNav } from '@/components/top-nav.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import AppsProviderGrid from '@/components/provider/provider-grid.tsx'
import { useState } from 'react'
import WorkflowGetStarted from '@/pages/get-started/components/WorkflowGetStarted.tsx'
import { AnimatePresence } from 'framer-motion'
import EnvironmentGetStarted from '@/pages/get-started/components/EnvironmentGetStarted.tsx'
import SendNotificationGetStarted from '@/pages/get-started/components/SendNotificationGetStarted.tsx'

const tabs = [
  {
    title: 'Create Provider',
    key: 'provider',
  },
  {
    title: 'Create Workflow',
    key: 'workflow',
  },
  {
    title: 'Environment',
    key: 'environment',
  },
  {
    title: 'Send notification',
    key: 'send-noti',
  },
]
export default function GetStarted() {
  const { theme } = useTheme()
  const [tab, setTab] = useState('provider')

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={[]} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <NotificationNav theme={theme} />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Get Started
          </h1>
        </div>
        <div className={'flex space-x-3 lg:space-x-6 w-full'}>
          <div className={'flex flex-col space-y-2 gap-6 w-[200px] font-semibold my-6'}>
            {tabs.map(e => (
              <div
                key={e.key}
                className={`${tab === e.key
                  ? theme === 'light'
                    ? 'bg-green-100'
                    : 'bg-slate-900'
                  : 'hover:bg-slate-100 hover:dark:bg-slate-800'} px-5 py-2 rounded-lg cursor-pointer`}
                onClick={() => setTab(e.key)}
              >
                {e.title}
              </div>
            ))}
          </div>
          <div className={'flex-1 py-8'}>
            <AnimatePresence>
              {tab === 'provider'
                ? <AppsProviderGrid key={'provider'} />
                : tab === 'workflow'
                  ? <WorkflowGetStarted key={'workflow'} />
                  : tab === 'environment'
                    ? <EnvironmentGetStarted />
                    : tab === 'send-noti'
                      ? <SendNotificationGetStarted />
                      : null}
            </AnimatePresence>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}