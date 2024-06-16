import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'
import { PaginationState } from '@tanstack/react-table'
import { useTheme } from '@/components/theme-provider.tsx'
import { redirect, useParams, useSearchParams } from 'react-router-dom'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { IChannel, ISubscription } from '@/types/subscription.interface.ts'
import { IPageResponse, pageDefault } from '@/types'

const SubscriptionRepository = RepositoryFactory.get('sub')

export default function ChannelDetail() {
  const { theme } = useTheme()
  const { id } = useParams()
  const [subscriptions, setSubscriptions] = useState<IPageResponse<ISubscription>>(pageDefault)
  const [channel, setChannel] = useState<IChannel | null>(null)
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const channelId = id ?? ''
  const fetchData = throttle(async (channelId: string) => {
    const rspChannel = await SubscriptionRepository.getChannel(channelId)
    if (rspChannel?.status === HttpStatusCode.Ok) {
      setChannel(rspChannel.data)
    } else {
      redirect('/404')
    }

    const rsp = await SubscriptionRepository.byChannel({
      channel_id: channelId,
    })

    if (rsp.status === HttpStatusCode.Ok) {
      setSubscriptions(rsp.data)
    }
  }, 200, { leading: true })

  useEffect(() => {
    console.log(id)
    if (channelId)
      fetchData(channelId)
  }, [channelId])
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
            <h2 className="text-2xl font-bold tracking-tight inline-flex space-x-1.5">
              <div>Channel</div>
              <div className={'text-green-500 underline'}>{channel?.channelName}</div>
            </h2>
          </div>
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
              fetchData(channelId)
            }, 300)}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
