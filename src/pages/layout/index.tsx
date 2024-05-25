import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout.tsx'
import { TopNav } from '@/components/top-nav.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { NotificationNav } from '@/components/notification/notification-nav.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { toast } from '@/components/ui/use-toast.ts'
import EmailTemplates from '@/pages/workflow/components/email-templates.tsx'
import React, { useRef } from 'react'
import { EditorRef } from 'react-email-editor'
import { Button } from '@/components/custom/button.tsx'
import { Link } from 'react-router-dom'

export default function LayoutEmail() {
  const { theme } = useTheme()
  const emailEditorRef = useRef<EditorRef>(null)

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
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
            Email layouts
          </h1>
          <Link to={'/layout/create'} className="flex items-center space-x-2">
            <Button>Create layout</Button>
          </Link>
        </div>
        <EmailTemplates
          callback={(design) => {
            try {
              const des = JSON.parse(design)

              emailEditorRef.current?.editor?.loadDesign(des)
            } catch (e) {
              toast({
                variant: 'destructive',
                title: 'An error occurred when import design template',
              })
            }
          }}
        />
      </LayoutBody>
    </Layout>
  )
}