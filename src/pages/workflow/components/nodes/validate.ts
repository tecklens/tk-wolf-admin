import { NodeDataInterface } from '@/types/node-data.interface.ts'
import { ChannelTypeEnum } from '@/types/channel'

export const validateNode = (nodeData: NodeDataInterface, type: string) => {
  if (type === ChannelTypeEnum.EMAIL) {
    return nodeData?._providerId && nodeData?.subject && nodeData?.sender && nodeData?.design
  } else if (type === ChannelTypeEnum.DELAY) {
    return nodeData?.delayTime && nodeData?.period
  } else if (type === 'trigger') {
    return nodeData?.webhookUrl && nodeData?.method
  } else if (type === ChannelTypeEnum.SMS) {
    return nodeData?._providerId && nodeData?.content
  } else return true
}