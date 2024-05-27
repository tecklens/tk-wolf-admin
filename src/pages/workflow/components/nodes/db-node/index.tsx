import { memo } from 'react'
import { Handle, NodeProps, Position, useNodeId } from 'reactflow'
import { IconCheck, IconDatabase, IconPlugX } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { WrapperNode } from '@/pages/workflow/components/WrapperNode.tsx'
import { NodeDataInterface } from '@/types/node-data.interface.ts'

const DbNode = memo((nodeInfo: NodeProps<NodeDataInterface>) => {
  const { data, isConnectable } = nodeInfo
  const { theme } = useTheme()
  const nodeId = useNodeId()
  const { node, select } = useNode()

  const openSetting = () => {
    select(nodeInfo)
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
        ${node?.id === nodeId ? 'border-[#66d9e8]' : ''} 
        rounded-xl shadow-xl w-[250px] hover:shadow-cyan-300/50 hover:shadow-lg border-2`}
      >
        <div
          className={'p-1 rounded-full bg-[rgb(22,163,74)] flex items-center justify-center absolute -right-2.5 -top-2.5'}>
          <IconCheck size={18} color={'white'} />
        </div>
        <div className={'flex flex-col space-y-2 divide-y'}>
          <div className={'inline-flex space-x-2 items-center px-4 pt-2'}>
            <IconDatabase size={28} color={'rgb(22 163 74)'} />
            <div className={'font-bold text-lg'}>Save database</div>
          </div>
          <div className={'flex flex-col px-4 py-2 text-xs'}>
            Save database
          </div>
          <div className={'flex flex-col'}>
            <div className={'inline-flex items-center text-xs px-3 py-1 space-x-1 text-[#E64545]'}
                 onClick={e => e.stopPropagation()}>
              <IconPlugX size={12} />
              <div>Select primary provider</div>
            </div>
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

export default DbNode