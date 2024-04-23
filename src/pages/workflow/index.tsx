import {Button} from '@/components/custom/button'
import {Search} from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import {TopNav} from '@/components/top-nav'
import {UserNav} from '@/components/user-nav'
import {Layout, LayoutBody, LayoutHeader} from '@/components/custom/layout'
import WorkflowPane from '@/pages/workflow/components/workflow-pane.tsx'
import {IconCheck, IconDownload, IconPlus, IconSettings} from '@tabler/icons-react'
import {Link} from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {throttle} from "lodash";
import {useWorkflow} from "@/lib/store/workflowStore.ts";

export default function Workflow() {
  const [wName, setWName] = useState('Workflow')

  const {fetchWf, workflows, workflow} = useWorkflow()

  const saveName = throttle(() => {

  }, 100)

  useEffect(() => {
    fetchWf()
  }, [])

  return (
    <Layout className={'min-h-[100vh]'}>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav}/>
        <div className="ml-auto flex items-center space-x-4">
          <Search/>
          <ThemeSwitch/>
          <UserNav/>
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4 h-full flex flex-col">
        <div className="flex items-center justify-between space-y-2">
          <div className={'inline-flex space-x-2 items-center'}>
            <Input className={''} value={workflow?.name} onChange={e => setWName(e.target.value)}></Input>
            <Button variant={'default'} disabled={wName === 'Workflow'} onClick={saveName}><IconCheck className={'mr-1'}
                                                                                                      size={18}/>Lưu</Button>
            <Button variant="default" className={'aspect-square'} size={'icon'}><IconSettings /></Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="min-w-[250px]">
                <SelectValue placeholder="Select a fruit"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  {workflows?.map(e => (
                    <SelectItem value={e._id}>{e.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Link to={'/workflow?create=true'}>
              <Button variant={'secondary'}><IconPlus className={'mr-1'} size={18}/>Add Workflow</Button>
            </Link>
            <Button variant={'outline'}><IconDownload className={'mr-1'} size={18}/>Export</Button>
          </div>
        </div>
        <div className="space-y-4 h-full flex flex-col flex-1 relative">
          <WorkflowPane/>
        </div>
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
