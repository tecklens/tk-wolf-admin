import {
  addEdge,
  Background,
  Controls,
  getIncomers,
  getOutgoers,
  MiniMap,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import DbNode from '@/pages/workflow/components/nodes/db-node'
import EmailNode from '@/pages/workflow/components/nodes/email-node'
import SmsNode from '@/pages/workflow/components/nodes/sms-node'
import DelayNode from '@/pages/workflow/components/nodes/delay-node'
import TriggerNode from '@/pages/workflow/components/nodes/trigger-node'
import WorkflowSidebar from '@/pages/workflow/components/sidebar.tsx'
import { DragEvent, type MouseEvent as ReactMouseEvent, useCallback, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ConnectionLine from '@/pages/workflow/components/connection-line.tsx'
import WebhookNode from '@/pages/workflow/components/nodes/webhook-node'
import NodeInfo from '@/pages/workflow/components/node-info'
import { useNode } from '@/lib/store/nodeStore.ts'
import StarterNode from '@/pages/workflow/components/nodes/starter-node'

const nodeTypes = {
  db: DbNode,
  email: EmailNode,
  sms: SmsNode,
  delay: DelayNode,
  trigger: TriggerNode,
  webhook: WebhookNode,
  starter: StarterNode,
}
const minimapStyle = {
  height: 120,
}


let id = 10;
const getId = () => `dndnode_${id++}`;

export default function WorkflowPane() {
  const selectNode = useNode((state) => state.select)
  const reactFlowWrapper = useRef(null)
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState([
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'db' },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' }, type: 'db' },
  ])
  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState([])

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: any) => {
      const es = {
        ...params,
        id: uuidv4(),
        type: 'smoothstep',
        marker: 'edge-marker-red',
        style: {
          strokeWidth: 2.5,
          'strokeDasharray': 5,
          stroke: '#98A0B3',
        },
        className: 'stroke-cyan-500',
      }

      setEdges((eds) => addEdge(es, eds))
    },
    [],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: any = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const getAllIncomers: any = (node: any) => {
    return getIncomers(node, nodes, edges).reduce(
      (memo: any[], incomer) => [...memo, incomer, ...getAllIncomers(incomer)],
      [],
    )
  }

  const getAllOutgoes: any = (node: any) => {
    return getOutgoers(node, nodes, edges).reduce(
      (memo: any[], outgo) => [...memo, outgo, ...getAllOutgoes(outgo)],
      [],
    )
  }

  const highlightPath = (node: any, selection: any) => {
    if (node) {
      const allIncomers = getAllIncomers(node)
      const allOutgoes = getAllOutgoes(node)

      const incomerIds = allIncomers.map((i: any) => i.id)
      const outgoIds = allOutgoes.map((o: any) => o.id)

      setNodes((prevElements) => {
        return prevElements?.map((elem) => {

          if (allOutgoes.length > 0 || allIncomers.length > 0) {
            const highlight = elem.id === node.id || incomerIds.includes(elem.id) || outgoIds.includes(elem.id)

            elem.style = {
              ...elem.style,
              opacity: highlight ? 1 : 0.25,
            }
          }

          return elem
        })
      })

      setEdges((prevElements) => {
        return prevElements?.map((elem) => {

          if (selection) {
            const animated =
              incomerIds.includes(elem.source) && (incomerIds.includes(elem.target) || node.id === elem.target)
            elem.animated = animated

            elem.style = {
              ...elem.style,
              stroke: animated ? '#3232ff' : '#98A0B3',
              opacity: animated ? 1 : 0.25,
            }
          } else {
            elem.animated = false
            elem.style = {
              ...elem.style,
              stroke: '#98A0B3',
              opacity: 1,
            }
          }

          return elem
        })
      })
    }
  }

  const resetNodeStyles = () => {
    setNodes((prevElements) => {
      return prevElements?.map((elem) => {
        elem.style = {
          ...elem.style,
          opacity: 1,
        }

        return elem
      })
    })
    setEdges((prevElements) => {
      return prevElements?.map((elem) => {
        elem.animated = false
        elem.style = {
          ...elem.style,
          stroke: '#98A0B3',
          opacity: 1,
        }
        return elem
      })
    })
  }

  const onNodeClick = (_event: ReactMouseEvent, node: any) => {
    if (node) {
      selectNode(node)
    }
  }

  return (
      <ReactFlowProvider>
        <div className="flex-1 h-full flex flex-col" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            connectionLineComponent={ConnectionLine}
            className={'flex-1'}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={(e) => setReactFlowInstance(e)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={() => {
              selectNode(undefined)
              resetNodeStyles()
            }}
            onNodeMouseEnter={(_event, node) => highlightPath(node, true)}
            onNodeMouseLeave={() => resetNodeStyles()}
          >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
        <WorkflowSidebar />
        <NodeInfo />
      </ReactFlowProvider>
  )
}