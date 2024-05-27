import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import React, { useEffect } from 'react'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { ReactFlowProvider } from 'reactflow'
import WorkflowContainer from '@/pages/workflow/components/workflow-container.tsx'

export default function Workflow() {
  const {
    fetchWf,
  }
    = useWorkflow()

  useEffect(() => {
    fetchWf()
  }, [])

  return (
    <Layout className={'min-h-[100vh]'}>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4 h-full flex flex-col">
        <ReactFlowProvider>
          <WorkflowContainer />
        </ReactFlowProvider>
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

