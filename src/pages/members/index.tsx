import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { Search } from '@/components/search.tsx'
import { WsStatus } from '@/components/ws-status.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useOrg } from '@/lib/store/orgStore.ts'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/auth.tsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@/components/ui/avatar.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconSend, IconSend2 } from '@tabler/icons-react'

export default function Members() {
  const { members, fetchMembers } = useOrg()
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      fetchMembers()
    }
  }, [token])
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

      <LayoutBody className="flex flex-col space-y-4" fixedHeight>
        <div className="flex items-center justify-between space-y-2">
          <div className={'inline-flex space-x-2 items-center'}>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Members
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Input placeholder={'Invite member by email'} />
            <Button variant={'default'}><IconSend size={16} className={'mr-1'} />Invite</Button>
          </div>
        </div>
        {members ? members.map(e => {
            return (<div className={'w-full inline-flex space-x-3 items-center'} key={e._id}>
              <div>
                <Avatar>
                  <AvatarImage src={e.user?.profilePicture} alt={e.user?.email} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className={'flex flex-col space-y-1 flex-1'}>
                <div>{e.user?.firstName} {e.user?.lastName}</div>
                <div className={'text-slate-500 text-sm'}>{e.user?.email}</div>
              </div>
              <div>
                <div className={'px-2 py-1 border rounded'}>{e.roles}</div>
              </div>
            </div>)
          })
          : null}
      </LayoutBody>
    </Layout>
  )
}