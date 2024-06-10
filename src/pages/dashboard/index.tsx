import { Button } from '@/components/custom/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { useEffect, useState } from 'react'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { ErrorChart } from '@/pages/dashboard/components/error-chart.tsx'
import { BillingChart } from '@/pages/dashboard/components/billing-chart.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { Link } from 'react-router-dom'
import { throttle } from 'lodash'

const AuthS = RepositoryFactory.get('auth')
const AnalS = RepositoryFactory.get('anal')

export default function Dashboard() {
  const [rReq, setRRequest] = useState(0)
  const [dashboardInfo, setDashboardInfo] = useState<{
    total_call_api?: number;
    total_subscriptions?: number;
    total_money?: number;
  } | null>(null)
  const { theme } = useTheme()

  const fetchData = throttle(async () => {
    const rep = await AuthS.getRemainingRequest()

    if (rep.status === HttpStatusCode.Ok) {
      setRRequest(rep.data)
    }

    const rspInfo = await AnalS.dashboard({})
    if (rspInfo.status === HttpStatusCode.Ok) {
      setDashboardInfo(rspInfo.data)
    }
  }, 500)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <NotificationNav theme={theme} />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
        </div>
        <Card className={'w-full flex justify-between p-3 items-center'}>
          <div className={'text-xl font-semibold inline-flex space-x-2'}>
            <div>Welcome to our website</div>
            <img src={'/images/congrat-popper.png'} alt={'congrats'} className={'h-6 w-6'} />
          </div>
          <Link to={'get-started'}>
            <Button>Get Started</Button>
          </Link>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Call Api
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardInfo?.total_call_api ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Money</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Remaining Request
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{rReq}</div>
              <p className="text-xs text-muted-foreground">
                per month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Overview />
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                You made 265 sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ErrorChart />
          <BillingChart />
        </div>
      </LayoutBody>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'overview',
    isActive: true,
    target: '_blank',
  },
  {
    title: 'Document',
    href: 'https://docs.wolf.app',
    isActive: false,
    target: '_blank',
  },
  {
    title: 'Pricing',
    href: 'pricing',
    isActive: false,
    target: '_blank',
  },
]
