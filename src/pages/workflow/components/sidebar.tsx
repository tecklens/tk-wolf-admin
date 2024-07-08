import DbNodePreview from '@/pages/workflow/components/nodes/db-node/preview.tsx'
import TriggerNodePreview from '@/pages/workflow/components/nodes/trigger-node/preview.tsx'
import { DragEvent } from 'react'
import { useTheme } from '@/components/theme-provider.tsx'
import DelayNodePreview from '@/pages/workflow/components/nodes/delay-node/preview.tsx'
import EmailNodePreview from '@/pages/workflow/components/nodes/email-node/preview.tsx'
import SmsNodePreview from '@/pages/workflow/components/nodes/sms-node/preview.tsx'
import WebhookNodePreview from '@/pages/workflow/components/nodes/webhook-node/preview.tsx'
import ConditionNodePreview from '@/pages/workflow/components/nodes/condition-node/preview.tsx'
import MessageNodePreview from '@/pages/workflow/components/nodes/message-node/preview.tsx'

export default function WorkflowSidebar() {
  const { theme } = useTheme()
  const onDragStart = (event: DragEvent, nodeType: string) => {
    console.log(nodeType)
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className={`wf-sidebar absolute right-0 top-0 ${theme === 'dark' ? 'bg-[#1e1e26]' : 'bg-white'} rounded-l flex flex-col space-y-4 p-2`}>
      {/*<DbNodePreview onDragStart={onDragStart} />*/}
      <ConditionNodePreview onDragStart={onDragStart} />
      <DelayNodePreview onDragStart={onDragStart} />
      <EmailNodePreview onDragStart={onDragStart} />
      <SmsNodePreview onDragStart={onDragStart} />
      <WebhookNodePreview onDragStart={onDragStart} />
      <MessageNodePreview onDragStart={onDragStart} />
    </div>
  )
}