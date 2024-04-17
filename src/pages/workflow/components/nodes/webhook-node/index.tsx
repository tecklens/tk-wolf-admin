import { memo } from 'react'
import { Handle, Position, useNodeId } from 'reactflow'
import { IconSailboat } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'

// eslint-disable-next-line react-refresh/only-export-components
export default memo(({ isConnectable }: {isConnectable: boolean }) => {
  const { theme } = useTheme()
  const nodeId = useNodeId()
  const node = useNode(state => state.node)

  return (
    <>
      <div
        className={`${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'}
        ${node?.id === nodeId ? 'border-[#66d9e8]' : ''}  
        rounded-xl shadow-xl w-[250px] hover:shadow-cyan-300/50 hover:shadow-lg border-2`}
      >
        <div className={'flex flex-col space-y-2 divide-y'}>
          <div className={'inline-flex space-x-2 items-center px-4 pt-2'}>
            <IconSailboat color={'rgb(244,75,14)'} size={28}/>
            <div className={'font-bold text-lg'}>Webhook</div>
          </div>
          <div className={'flex flex-col px-4 py-2 text-xs'}>
            Webhook
          </div>
        </div>
        <Handle
          type='source'
          id='tigger-red'
          position={Position.Right}
          className={'w-3 h-3 -right-2 !bg-teal-500 handle-inner'}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <Handle
          type='target'
          position={Position.Left}
          id='trigger-blue'
          className={'w-3 h-3 -left-2 !bg-blue-500 handle-inner'}
          isConnectable={isConnectable}
        />
      </div>
    </>
  )
})
