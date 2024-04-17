import {Button} from '@/components/custom/button'
import {Search} from '@/components/search'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import {TopNav} from '@/components/top-nav'
import {UserNav} from '@/components/user-nav'
import {Layout, LayoutBody, LayoutHeader} from '@/components/custom/layout'
import WorkflowPane from "@/pages/workflow/components/workflow-pane.tsx";

export default function Dashboard() {
  return (
    <Layout className={'min-h-[100vh]'}>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav}/>
        <div className='ml-auto flex items-center space-x-4'>
          <Search/>
          <ThemeSwitch/>
          <UserNav/>
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4 h-full flex flex-col'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Workflows
          </h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4 flex-1 flex flex-col'
        >
          <div className='w-full pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4 h-full flex flex-col flex-1'>
            <WorkflowPane/>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]
