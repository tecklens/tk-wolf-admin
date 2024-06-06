import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { TopNav } from '@/components/top-nav.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import AppsProviderGrid from '@/components/provider/provider-grid.tsx'


export default function GetStarted() {
  const { theme } = useTheme()
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
        <div className={'flex space-x-3 w-full'}>
          <div className={'flex flex-col space-y-2 gap-6 w-[200px] font-semibold my-6'}>
            <div className={`${theme === 'light' ? 'bg-green-100' : 'bg-slate-900'} px-5 py-2 rounded-lg cursor-pointer`}>Create Provider</div>
            <div className={'px-5 py-2 rounded-lg cursor-pointer'}>Create Workflow</div>
            <div className={'px-5 py-2 rounded-lg cursor-pointer'}>Get API key</div>
            <div className={'px-5 py-2 rounded-lg cursor-pointer'}>Send notification</div>
          </div>
          <div className={'flex-1'}>
            <AppsProviderGrid />
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}