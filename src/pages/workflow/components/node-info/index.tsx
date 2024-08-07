import './node-info.css'
import { useNode } from '@/lib/store/nodeStore.ts'
import WebhookNodeInfo from '@/pages/workflow/components/node-info/webhook-node-info.tsx'
import EmailNodeInfo from '@/pages/workflow/components/node-info/email-node-info.tsx'
import DelayNodeInfo from '@/pages/workflow/components/node-info/delay-node-info.tsx'
import { ChannelTypeEnum } from '@/types/channel'
import SmsNodeInfo from '@/pages/workflow/components/node-info/sms-node-info.tsx'
import ConditionNodeInfo from '@/pages/workflow/components/node-info/condition-node-info.tsx'
import MessageNodeInfo from '@/pages/workflow/components/node-info/message-node-info.tsx'

export default function NodeInfo({ onClose, reloadNode }: {
  onClose: () => void,
  reloadNode: (nodeId: string) => void
}) {
  const { node } = useNode((state) => state)

  return (
    <div className={'h-full flex flex-col'}>
      {node?.type === ChannelTypeEnum.WEBHOOK
        ? <WebhookNodeInfo onClose={onClose} reloadNode={() => reloadNode(node.id)} />
        : node?.type === ChannelTypeEnum.EMAIL
          ? <EmailNodeInfo designHtml={node?.data?.designHtml} />
          : node?.type === ChannelTypeEnum.DELAY
            ? <DelayNodeInfo onClose={onClose} reloadNode={() => reloadNode(node.id)} />
            : node?.type === ChannelTypeEnum.SMS
              ? <SmsNodeInfo content={node.data?.content} />
            : node?.type === ChannelTypeEnum.CONDITION
                ? <ConditionNodeInfo onClose={onClose} reloadNode={() => reloadNode(node.id)} />
                : node?.type === ChannelTypeEnum.CHAT
                  ? <MessageNodeInfo content={node.data?.content} />
                  : null}
    </div>
  )
}