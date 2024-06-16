import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { PaginationState } from '@tanstack/react-table'
import { useSubscription } from '@/lib/store/subscriptionStore.ts'
import { Button } from '@/components/custom/button.tsx'
import { IconExternalLink } from '@tabler/icons-react'
import { DOCS_URL } from '@/constant'

export default function Subscription() {
  const { subscriptions, fetchAllSubscriptions } = useSubscription()
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = throttle(() => {
    fetchAllSubscriptions({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
    })
  }, 200, { leading: true })

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(fetchData, 5000)

    return () => intervalId && clearInterval(intervalId)
  }, [fetchAllSubscriptions])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
          </div>
          <Button
            onClick={() => {
              window.open(`${DOCS_URL}/subscription`, '_blank');
            }}
            variant={'outline'} className={'flex space-x-1.5'}><IconExternalLink size={18} />
            <div>Docs</div>
          </Button>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable
            data={subscriptions.data}
            columns={columns}
            totalCount={subscriptions.total ?? 0}
            page={page.current}
            onPageChange={throttle((p: PaginationState) => {
              page.current = {
                pageSize: p.pageSize,
                pageIndex: p.pageIndex,
              }
              fetchData()
            }, 300)}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
