import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import DbNode from '@/pages/workflow/components/nodes/db-node'
import EmailNode from '@/pages/workflow/components/nodes/email-node'
import SmsNode from '@/pages/workflow/components/nodes/sms-node'
import DelayNode from '@/pages/workflow/components/nodes/delay-node'
import WorkflowSidebar from '@/pages/workflow/components/sidebar.tsx'
import { DragEvent, type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ConnectionLine from '@/pages/workflow/components/connection-line.tsx'
import WebhookNode from '@/pages/workflow/components/nodes/webhook-node'
import NodeInfo from '@/pages/workflow/components/node-info'
import { useNode } from '@/lib/store/nodeStore.ts'
import StarterNode from '@/pages/workflow/components/nodes/starter-node'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { throttle } from 'lodash'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import EditEmail from '@/pages/workflow/components/edit-email.tsx'
import SelectProvider from '@/pages/workflow/components/select-provider.tsx'
import EdgeWithClose from '@/pages/workflow/components/edges/edge-with-close.tsx'
import EditSms from '@/pages/workflow/components/edit-sms.tsx'
import ViewportChangeLogger from '@/pages/workflow/components/viewport-change-logger.ts'
import ConditionNode from '@/pages/workflow/components/nodes/condition-node'
import MessageNode from '@/pages/workflow/components/nodes/message-node'

const WorkflowRepository = RepositoryFactory.get('wf')

const nodeTypes = {
  db: DbNode,
  email: EmailNode,
  sms: SmsNode,
  delay: DelayNode,
  condition: ConditionNode,
  webhook: WebhookNode,
  starter: StarterNode,
  chat: MessageNode,
}

const edgeTypes = {
  closeable: EdgeWithClose,
}
const minimapStyle = {
  height: 120,
}


let id = 10
const getId = () => `dndnode_${id++}`

export default function WorkflowPane() {
  const { workflow, select, selectingProvider, openModalProvider } = useWorkflow()
  const selectNode = useNode((state) => state.select)
  const nodeSelected = useNode((state) => state.node)
  const { emailEdit, openEmailEdit, smsEdit, openSmsEdit } = useNode((state) => state)
  const { toast } = useToast()
  const reactFlowWrapper = useRef(null)
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState([])
  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState([])

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  function mapNode(node: any): Node {
    return {
      ...node,
      id: node._id,
      data: {
        ...node?.data,
        _providerId: node._providerId,
        _workflowId: node._workflowId,
        name: node.name,
        onDelete: (id: string) => deleteNodeById(id),
        onReload: (id: string) => reloadNode(id),
      },
    }
  }

  const onConnect = useCallback(
    async (params: any) => {
      const es = {
        ...params,
        id: uuidv4(),
        type: 'closeable',
        marker: 'edge-marker-red',
        style: {
          strokeWidth: 2.5,
          'strokeDasharray': 5,
          stroke: '#98A0B3',
        },
        className: 'stroke-cyan-500',
      }

      const addEdgeRsp: AxiosResponse = await WorkflowRepository.addEdge({
        ...es,
        workflowId: workflow?._id,
      })

      if (addEdgeRsp.status === HttpStatusCode.Created) {
        setEdges((eds) => addEdge(es, eds))
      } else {
        toast({
          title: 'Add Edge to Flow',
          description: 'Add Edge Failed',
          variant: 'destructive',
        })
      }
    },
    [],
  )

  const deleteNodeById = async (id: string) => {
    const node = reactFlowInstance?.getNodes().find(e => e.id === id)
    if (!node || !workflow) return

    const connectedEdges = getConnectedEdges([node], edges)

    const rsp = await WorkflowRepository.delEle({
      nodeIds: [id],
      edgeIds: connectedEdges.map(e => e.id),
      workflowId: workflow?._id,
    })
    if (rsp.status === HttpStatusCode.Created) {
      setNodes((nds: Node[]) => nds.filter((node) => node.id !== id))
      setEdges((eds) => {
        return eds.filter((edge: Edge) => !connectedEdges.includes(edge))
      })
    } else {
      toast({
        title: 'Delete from flow failed',
        variant: 'destructive',
      })
    }
  }

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault()
      if (!workflow) return

      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const addNodeRsp: AxiosResponse = await WorkflowRepository.addNode({
        id: getId(),
        type,
        position,
        data: {
          label: `${type} node`,
        },
        workflowId: workflow?._id,
      })

      if (addNodeRsp.status === HttpStatusCode.Created) {
        setNodes((nds) => {
          const n = mapNode(addNodeRsp.data)
          console.log(n)
          return nds.concat(n)
        })
      } else {
        toast({
          title: 'Add Node',
          description: 'Add Node Failed',
          variant: 'destructive',
        })
      }

    },
    [reactFlowInstance, setNodes, toast, workflow?._id],
  )

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

  const onNodeDragStop = throttle(async (_event: ReactMouseEvent, node: Node, _nodes: Node[]) => {
    const rsp = await WorkflowRepository.updateNode([node])

    if (rsp.status !== HttpStatusCode.Ok) {

      toast({
        title: 'An error occurred',
        variant: 'destructive',
      })
    }
  }, 100)

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!reactFlowInstance) return false
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = reactFlowInstance.getNodes()
      const edges = reactFlowInstance.getEdges()
      const target: Node | undefined = nodes.find((node) => node.id === connection.target)
      const hasCycle = (node: Node | undefined, visited = new Set()) => {
        if (node === undefined) return true
        if (visited.has(node.id)) return false

        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }

      if (target?.id === connection.source) return false
      return !hasCycle(target)
    },
    [reactFlowInstance?.getNodes, reactFlowInstance?.getEdges],
  )

  const reloadNode = async (nodeId: string) => {
    const rsp = await WorkflowRepository.getOneNode(nodeId)

    if (rsp.status === HttpStatusCode.Ok) {
      setNodes(nds => nds.map(e => e.id === nodeId ? mapNode(rsp.data) : e))
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred when update data node',
      })
    }
  }

  useEffect(() => {
    if (workflow) {
      setNodes(() => workflow.nodes?.map(e => mapNode(e)))
      setEdges(() => workflow.edges?.map(e => ({
        ...e,
        id: e._id,
      })))
    }
  }, [workflow])

  return (
    <>
      <div className="flex-1 h-full flex flex-col" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          defaultViewport={workflow?.viewport ?? {
            x: 0,
            y: 0,
            zoom: 1
          }}
          connectionLineComponent={ConnectionLine}
          className={'flex-1'}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          zoomOnPinch={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onNodeDragStop={onNodeDragStop}
          onEdgesChange={onEdgesChange}
          isValidConnection={isValidConnection}
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
      <Sheet open={nodeSelected} onOpenChange={() => selectNode(null)}>
        <SheetContent className="w-fit lg:max-w-[800px] max-w-[500px]">
          <NodeInfo
            reloadNode={reloadNode}
            onClose={() => {
              selectNode(null)
            }}
          />
        </SheetContent>
      </Sheet>
      <Sheet open={selectingProvider.open} onOpenChange={() => openModalProvider({
        open: false,
        nodeId: null,
        channel: null,
      })}>
        <SheetContent className={''}>
          <SheetHeader>
            <SheetTitle>Select provider for step</SheetTitle>
            <SheetDescription>
              Make changes to provider here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <SelectProvider onSuccess={(nodeId, providerId, pName) => {
            setNodes(nds => nds.map(e => e.id === nodeId ? ({
              ...e,
              data: {
                ...e.data,
                providerId: providerId,
                providerName: pName,
              },
            }) : e))
            openModalProvider({
              open: false,
              nodeId: null,
              channel: null,
            })
          }} />
        </SheetContent>
      </Sheet>
      <Dialog open={emailEdit.open} onOpenChange={(val) => {
        openEmailEdit({
          open: val,
          data: null,
        })
      }}>
        <DialogContent className="min-w-[90vw] min-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit email template</DialogTitle>
          </DialogHeader>
          <div className={'flex-1 flex flex-col'}>
            <EditEmail onClose={() => {
              reloadNode(nodeSelected._id)
              openEmailEdit({
                open: false,
                data: null,
              })
            }} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={smsEdit.open} onOpenChange={(val) => {
        openSmsEdit({
          open: val,
          data: null,
        })
      }}>
        <DialogContent className="min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit sms template</DialogTitle>
          </DialogHeader>
          <EditSms onClose={() => {
            reloadNode(nodeSelected._id)
            selectNode(null)
            openSmsEdit({
              open: false,
              data: null,
            })
          }} />
        </DialogContent>
      </Dialog>
      <ViewportChangeLogger />
    </>
  )
}