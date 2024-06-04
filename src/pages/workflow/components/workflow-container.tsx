import { Button } from '@/components/custom/button.tsx'
import { IconDownload, IconPlus, IconSend, IconSettings, IconVariable } from '@tabler/icons-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import WorkflowPane from '@/pages/workflow/components/workflow-pane.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import WorkflowSetting from '@/pages/workflow/components/setting.tsx'
import ManageVariables from '@/pages/workflow/components/variables.tsx'
import React, { useState } from 'react'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { throttle } from 'lodash'
import { getRectOfNodes, getTransformForBounds, useReactFlow } from 'reactflow'
import { toPng } from 'html-to-image'
import WorkflowTour from '@/pages/workflow/components/workflow-tour.tsx'
import { Sheet, SheetContent } from '@/components/ui/sheet.tsx'
import NodeInfo from '@/pages/workflow/components/node-info'
import MakeApiContainer from '@/pages/workflow/components/make-api/make-api-container.tsx'

function downloadImage(dataUrl: any, name: string | undefined) {
  const a = document.createElement('a')

  a.setAttribute('download', name + '.png')
  a.setAttribute('href', dataUrl)
  a.click()
}

export default function WorkflowContainer() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const [nameCreate, setNameCreate] = useState('')
  const [openSendApi, setOpenSendApi] = useState(false)

  const {
    openEditVariable,
    setOpenEditVariable,
    create,
    select,
    workflows,
    workflow,
  }
    = useWorkflow()

  const createWf = throttle(async () => {
    const check = await create(nameCreate)
    if (check) {
      setOpenCreate(false)
      setNameCreate('')
    }
  }, 200)

  const { getNodes } = useReactFlow()

  const onDownloadPng = () => {
    const imageWidth = 1024, imageHeight = 768
    const nodesBounds = getRectOfNodes(getNodes())
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2)

    // @ts-ignore
    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((url) => downloadImage(url, workflow?.name))
  }

  return (
    <>
      <WorkflowTour />
      <div className="flex items-center justify-between space-y-2">
        <div className={'inline-flex space-x-2 items-center'}>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {workflow?.name}
          </h1>
        </div>
        <div className="flex items-center space-x-2 wf-toolbar">
          <Button
            onClick={() => setOpenSendApi(true)}
            className={`hidden md:flex aspect-square`}
            size={'icon'}
          >
            <IconSend />
          </Button>
          <Button
            disabled={!workflow}
            variant="default"
            className={'aspect-square'}
            size={'icon'}
            onClick={() => setOpenEditVariable(true)}><IconVariable /></Button>
          <Button variant="default" className={'aspect-square'} size={'icon'}
                  onClick={() => setOpenSetting(true)}><IconSettings /></Button>

          <Select value={workflow?._id} onValueChange={(val) => select(val)}>
            <SelectTrigger className="min-w-[250px]">
              <SelectValue placeholder="Select a workflow" />
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
          <Button variant={'secondary'} onClick={() => setOpenCreate(true)}><IconPlus className={'mr-1'}
                                                                                      size={18} />Add
            Workflow</Button>
          <Button
            variant={'outline'}
            onClick={onDownloadPng}
          >
            <IconDownload className={'mr-1'} size={18} />
            PNG
          </Button>
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
          <WorkflowSetting workflow={workflow} onClose={() => setOpenSetting(false)} />
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
          <ManageVariables workflow={workflow} onClose={() => setOpenEditVariable(false)} />
        </DialogContent>
      </Dialog>
      <Sheet open={openSendApi} onOpenChange={() => setOpenSendApi(false)}>
        <SheetContent className="w-full lg:max-w-[800px] max-w-[500px]">
          <MakeApiContainer />
        </SheetContent>
      </Sheet>
    </>
  )

}