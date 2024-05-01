import { NodeDataInterface } from '@/types/node-data.interface.ts'

export const validateNode = (nodeData: NodeDataInterface, type: string) => {
  if (type === 'email') {
    return nodeData?._providerId && nodeData?.subject && nodeData?.sender && nodeData?.design
  } else if (type === 'delay') {
    return nodeData?.delayTime && nodeData?.period
  } else if (type === 'trigger') {
    return nodeData?.webhookUrl && nodeData?.method
  } else return true
}