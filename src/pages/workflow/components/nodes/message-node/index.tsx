import React, {memo, useMemo} from 'react'
import {Handle, NodeProps, Position, useNodeId} from 'reactflow'
import {IconBug, IconCheck, IconCircleCheckFilled, IconMessageChatbot, IconPlugX} from '@tabler/icons-react'
import {useTheme} from '@/components/theme-provider.tsx'
import {useNode} from '@/lib/store/nodeStore.ts'
import {WrapperNode} from '@/pages/workflow/components/wrapper-node.tsx'
import {NodeDataInterface} from '@/types/node-data.interface.ts'
import {validateNode} from "@/pages/workflow/components/nodes/validate.ts";
import {ChannelTypeEnum} from "@/types/channel";
import {useWorkflow} from "@/lib/store/workflowStore.ts";

const MessageNode = memo((nodeInfo: NodeProps<NodeDataInterface>) => {
  const {data, isConnectable} = nodeInfo
  const {theme} = useTheme()
  const nodeId = useNodeId()
  const {node, select} = useNode()
  const openModalProvider = useWorkflow(state => state.openModalProvider)

  const openSetting = () => {
    select(nodeInfo)
  }

  const validNode = useMemo(() => validateNode(data, 'chat'), [data])

  const openProvider = () => {
    openModalProvider({
      nodeId: nodeId,
      channel: ChannelTypeEnum.CHAT,
      open: true,
    })
  }

  return (
    <WrapperNode
      onDelete={() => {
        data.onDelete(nodeId ?? '')
      }}
      openSetting={openSetting}
      reloadNode={() => data.onReload(nodeId ?? '')}
    >
      <div
        className={`${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'}
        ${validNode ? 'border-[rgb(22,163,74)]' : 'border-red-500'}   
        rounded-xl shadow-xl w-[250px] hover:shadow-cyan-300/50 hover:shadow-lg border-2`}
      >
        {validNode ? <div
            className={'p-1 rounded-full bg-[rgb(22,163,74)] flex items-center justify-center absolute -right-2.5 -top-2.5'}>
            <IconCheck size={18} color={'white'}/>
          </div>
          : <div
            className={'p-1 rounded-full bg-red-600 flex items-center justify-center absolute -right-2.5 -top-2.5'}>
            <IconBug size={18}/>
          </div>}
        <div className={'flex flex-col space-y-2 divide-y'}>
          <div className={'inline-flex space-x-2 items-center px-4 pt-2'}>
            <IconMessageChatbot size={28} color={'rgb(22 163 74)'}/>
            <div className={'font-bold text-lg'}>Message Chat</div>
          </div>
            <div className={'w-full px-4 pt-2 text-xs whitespace-nowrap overflow-hidden truncate'}>
              {data.content ? data.content?.plainText : <span className={'text-red-600'}>Message content is missing</span>}
            </div>
          <div className={'flex flex-col px-3 py-2 text-xs'}>
            {!data?._providerId ?
              <div className={'inline-flex justify-between'}>
                <div className={'inline-flex items-center text-xs space-x-1 text-[#E64545]'}>
                  <IconPlugX size={12}/>
                  <div>Select primary provider</div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    openProvider()
                  }}
                  className={'py-0.5 border px-2 border-red-500 rounded'}>
                  Select
                </button>
              </div>
              : <div className={'inline-flex items-center text-xs space-x-1 text-green-500'}>
                <IconCircleCheckFilled size={12}/>
                <div>{data?.providerName} (Provider)</div>
              </div>}
          </div>
        </div>
        <Handle
          type="source"
          id="red"
          position={Position.Right}
          className={'w-3 h-3 -right-2 !bg-teal-500 handle-inner'}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="blue"
          className={'w-3 h-3 -left-2 !bg-blue-500 handle-inner'}
          isConnectable={isConnectable}
        />
      </div>
    </WrapperNode>
  )
})

export default MessageNode