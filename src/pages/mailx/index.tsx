import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import React from 'react'
import { useTheme } from '@/components/theme-provider.tsx'
import { accounts, mails } from '@/pages/mailx/data.tsx'
import { Mail } from '@/pages/mailx/components/mail.tsx'

export default function Mailx() {
  const { theme } = useTheme()
  const layout = localStorage.getItem("react-resizable-panels:layout")
  const collapsed = localStorage.getItem("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <NotificationNav theme={theme} />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="hidden flex-col md:flex">
          <Mail
            accounts={accounts}
            mails={mails}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}