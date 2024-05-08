import { Button } from '@/components/custom/button'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import WorkflowPane from '@/pages/workflow/components/workflow-pane.tsx'
import { IconCheck, IconDownload, IconPlus, IconSettings, IconVariable } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { throttle } from 'lodash'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx'
import WorkflowSetting from "@/pages/workflow/components/setting.tsx";
import ManageVariables from '@/pages/workflow/components/variables.tsx'

export default function Workflow() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const [nameCreate, setNameCreate] = useState('')

  const { openEditVariable, setOpenEditVariable, create, select, fetchWf, workflows, workflow } = useWorkflow()

  const createWf = throttle(async () => {
    const check = await create(nameCreate)
    if (check) {
      setOpenCreate(false)
      setNameCreate('')
    }
  }, 200)

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
        <div className="flex items-center justify-between space-y-2">
          <div className={'inline-flex space-x-2 items-center'}>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {workflow?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="default" className={'aspect-square'} size={'icon'} onClick={() => setOpenEditVariable(true)}><IconVariable /></Button>
            <Button variant="default" className={'aspect-square'} size={'icon'} onClick={() => setOpenSetting(true)}><IconSettings /></Button>

            <Select value={workflow?._id} onValueChange={(val) => select(val)}>
              <SelectTrigger className="min-w-[250px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{workflow?.name}</SelectLabel>
                  {workflows?.map(e => (
                    <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant={'secondary'} onClick={() => setOpenCreate(true)}><IconPlus className={'mr-1'} size={18} />Add
              Workflow</Button>
            <Button variant={'outline'}><IconDownload className={'mr-1'} size={18} />Export</Button>
          </div>
        </div>
        <div className="space-y-4 h-full flex flex-col flex-1 relative">
          {workflow ?
            <WorkflowPane />
            :
            <div className={'flex-1 flex w-full h-full justify-center items-center'}>
              <Button variant={'secondary'} onClick={() => setOpenCreate(true)}><IconPlus className={'mr-1'}
                                                                                          size={18} />Add
                Workflow</Button>
            </div>
          }
        </div>
        <Dialog open={openCreate} onOpenChange={(val) => {
          setOpenCreate(val)
          setNameCreate('')
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Please enter workflow name</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder={'Workflow name....'} value={nameCreate}
                     onChange={e => setNameCreate(e.target.value)}></Input>
            </div>
            <DialogFooter>
              <Button disabled={!nameCreate} type="submit" onClick={createWf}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={openSetting} onOpenChange={(val) => {
          setOpenSetting(val)
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <WorkflowSetting workflow={workflow} onClose={() =>  setOpenSetting(false)}/>
            <DialogFooter>
              <Button type="submit" form={'modal-setting'}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditVariable} onOpenChange={(val) => {
          setOpenEditVariable(val)
        }}>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Variables</DialogTitle>
            </DialogHeader>
            <ManageVariables workflow={workflow} onClose={() =>  setOpenEditVariable(false)}/>
          </DialogContent>
        </Dialog>
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
