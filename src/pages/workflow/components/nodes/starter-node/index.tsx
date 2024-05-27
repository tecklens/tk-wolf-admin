import { memo } from 'react'
import { Handle, NodeProps, Position, useNodeId } from 'reactflow'
import { IconPlayerPlay } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { NodeDataInterface } from '@/types/node-data.interface.ts'

// eslint-disable-next-line react-refresh/only-export-components
export default memo((nodeInfo: NodeProps<NodeDataInterface>) => {
  const { data, isConnectable } = nodeInfo
  const { theme } = useTheme()
  const nodeId = useNodeId()
  const node = useNode(state => state.node)

  return (
    <div
      className={`${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'}
        ${node?.id === nodeId ? 'border-[#66d9e8]' : 'border-[rgb(244,75,14)]'} 
        shadow-xl w-[50px] hover:shadow-cyan-300/50 hover:shadow-lg border-2 rounded-full`}
    >
      <div className={''}>
        <div className={'inline-flex items-center justify-center p-2'}>
          <IconPlayerPlay size={28} />
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
      {/*<Handle*/}
      {/*  type='target'*/}
      {/*  position={Position.Left}*/}
      {/*  id='blue'*/}
      {/*  className={'w-3 h-3 -left-2 !bg-blue-500 handle-inner'}*/}
      {/*  isConnectable={isConnectable}*/}
      {/*/>*/}
    </div>
  )
})
