import React, { memo, useMemo } from 'react'
import { Handle, NodeProps, Position, useNodeId } from 'reactflow'
import { IconBrandDaysCounter, IconBug, IconCheck } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'
import { WrapperNode } from '@/pages/workflow/components/wrapper-node.tsx'
import { NodeDataInterface } from '@/types/node-data.interface.ts'
import { find } from 'lodash'
import { periods } from '@/pages/workflow/components/node-info/delay-node-info.tsx'
import { validateNode } from '@/pages/workflow/components/nodes/validate.ts'

// eslint-disable-next-line react-refresh/only-export-components
export default memo((nodeInfo: NodeProps<NodeDataInterface>) => {
  const { data, isConnectable } = nodeInfo
  const { theme } = useTheme()
  const nodeId = useNodeId()
  const { node, select } = useNode()

  const openSetting = () => {
    select(nodeInfo)
  }

  const validNode = useMemo(() => validateNode(data, 'delay'), [data])

  return (
    <WrapperNode
      onDelete={() => {
        data.onDelete(nodeId ?? '')
      }}
      openSetting={openSetting}
      disableMenu={['change-provider']}
      reloadNode={() => data.onReload(nodeId ?? '')}
    >
      <div
        className={`${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'}
        ${validNode ? 'border-[rgb(22,163,74)]' : 'border-red-500'}  
        rounded-xl shadow-xl w-[250px] hover:shadow-cyan-300/50 hover:shadow-lg border-2`}
      >
        {validNode ? <div
            className={'p-1 rounded-full bg-[rgb(22,163,74)] flex items-center justify-center absolute -right-2.5 -top-2.5'}>
            <IconCheck size={18} color={'white'} />
          </div>
          : <div
            className={'p-1 rounded-full bg-red-600 flex items-center justify-center absolute -right-2.5 -top-2.5'}>
            <IconBug size={18} />
          </div>}
        <div className={'flex flex-col space-y-2 divide-y'}>
          <div className={'inline-flex space-x-2 items-center px-4 pt-2'}>
            <IconBrandDaysCounter size={28} color={'rgb(102, 217, 232)'} />
            <div className={'font-bold text-lg flex-1'}>Delay</div>
            <div>{data.delayTime} {find(periods, e => e.value == data.period)?.label}</div>
          </div>
          <div className={'flex flex-col px-4 py-2 text-xs'}>
            Delay
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
