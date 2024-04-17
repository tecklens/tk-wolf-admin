import './node-info.css'
import { useNode } from '@/lib/store/nodeStore.ts'
import WebhookNodeInfo from '@/pages/workflow/components/node-info/webhook-node-info.tsx'

export default function NodeInfo() {
  const { node } = useNode((state) => state)

  if (node?.type === 'webhook') {
    return <WebhookNodeInfo />
  } else {
    return <div />
  }
}