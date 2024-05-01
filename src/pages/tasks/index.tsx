import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { WsStatus } from '@/components/ws-status.tsx'
import { useTask } from '@/lib/store/taskStore.ts'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { throttle } from 'lodash'
import { PaginationState } from '@tanstack/react-table'

export default function Tasks() {
  const { tasks, fetchTask } = useTask()
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = throttle(() => {
    fetchTask({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
    })
  }, 200, { leading: true })

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(fetchData, 5000)

    return () => intervalId && clearInterval(intervalId)
  }, [fetchTask])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <WsStatus />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">List task</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable
            data={tasks.data}
            columns={columns}
            totalCount={tasks.totalCount}
            page={page.current}
            onPageChange={throttle((p: PaginationState) => {
              console.log(p)

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
