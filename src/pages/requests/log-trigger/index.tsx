import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { PaginationState } from '@tanstack/react-table'
import { useAnalysis } from '@/lib/store/analysisStore.ts'

export default function LogTrigger() {
  const { logs, fetchLogsTrigger } = useAnalysis()
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = throttle(() => {
    fetchLogsTrigger({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
    })
  }, 200, { leading: true })

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(fetchData, 5000)

    return () => intervalId && clearInterval(intervalId)
  }, [fetchLogsTrigger])
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
            <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable
            data={logs.data}
            columns={columns}
            totalCount={logs.totalCount}
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
