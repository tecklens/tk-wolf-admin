import './node-info.css'
import { useNode } from '@/lib/store/nodeStore.ts'
import WebhookNodeInfo from '@/pages/workflow/components/node-info/webhook-node-info.tsx'
import { SheetClose, SheetFooter } from '@/components/ui/sheet.tsx'
import { Button } from '@/components/custom/button.tsx'
import EmailNodeInfo from '@/pages/workflow/components/node-info/email-node-info.tsx'
import { data } from 'autoprefixer'
import DelayNodeInfo from '@/pages/workflow/components/node-info/delay-node-info.tsx'

export default function NodeInfo({ onClose, reloadNode }: {
  onClose: () => void,
  reloadNode: (nodeId: string) => void
}) {
  const { node } = useNode((state) => state)

  return (
    <div className={'h-full flex flex-col'}>
      {node?.type === 'webhook'
        ? <WebhookNodeInfo onClose={onClose} reloadNode={() => reloadNode(node.id)} />
        : node?.type === 'email'
          ? <EmailNodeInfo designHtml={node?.data?.designHtml} />
          : node?.type === 'delay'
            ? <DelayNodeInfo onClose={onClose} reloadNode={() => reloadNode(node.id)} />
            : null}
    </div>
  )
}