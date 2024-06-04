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
import styles from './condition-node.module.css'

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
        className={`${styles.rhombusNode} ${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'}`}
      >
        {/*{validNode ? <div*/}
        {/*    className={'p-1 rounded-full bg-[rgb(22,163,74)] flex items-center justify-center absolute -right-2.5 -top-2.5'}>*/}
        {/*    <IconCheck size={18} color={'white'} />*/}
        {/*  </div>*/}
        {/*  : <div*/}
        {/*    className={'p-1 rounded-full bg-red-600 flex items-center justify-center absolute -right-2.5 -top-2.5'}>*/}
        {/*    <IconBug size={18} />*/}
        {/*  </div>}*/}
        <Handle
          type="source"
          id="yes"
          position={Position.Top}
          className={`${styles.handleSourceYes} w-3 h-3 !bg-teal-500 handle-inner`}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        >
          <div className={'absolute text-sm text-gray-400 -top-5 left-2'}>YES</div>
        </Handle>

        <Handle
          type="source"
          id="no"
          position={Position.Bottom}
          className={`${styles.handleSourceNo} w-3 h-3 !bg-red-500 handle-inner`}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        >
          <div className={'absolute text-sm text-gray-400 top-1 left-2'}>NO</div>
        </Handle>
        <Handle
          type="target"
          position={Position.Left}
          id="blue"
          className={`${styles.handleTarget} w-3 h-3 !bg-blue-500 handle-inner`}
          isConnectable={isConnectable}
        />
      </div>
    </WrapperNode>
  )
})
