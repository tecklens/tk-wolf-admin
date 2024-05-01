import React, { FC, useCallback } from 'react'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow'
import { IconXboxX } from '@tabler/icons-react'
import { HttpStatusCode } from 'axios'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { useTheme } from '@/components/theme-provider.tsx'

const WorkflowRepository = RepositoryFactory.get('wf')
const EdgeWithClose: FC<EdgeProps> = ({
                                        id,
                                        sourceX,
                                        sourceY,
                                        targetX,
                                        targetY,
                                        sourcePosition,
                                        targetPosition,
                                        style = {},
                                        markerEnd,
                                      }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const { theme } = useTheme()
  const workflow = useWorkflow(state => state.workflow)
  const { toast } = useToast()
  const { setEdges } = useReactFlow()

  const deleteEdge = useCallback(async () => {
    if (!workflow) return
    const rsp = await WorkflowRepository.delEle({
      edgeIds: [id],
      workflowId: workflow?._id,
    })
    if (rsp.status === HttpStatusCode.Created) {
      setEdges((edges) => edges.filter((edge) => edge.id !== id))
    } else {
      toast({
        title: 'Delete from flow failed',
        variant: 'destructive',
      })
    }
  }, [id, workflow])

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className={`nodrag nopan cursor-pointer rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
          onClick={deleteEdge}
        >
          <IconXboxX size={20} color={style.stroke} opacity={style.opacity} />
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default EdgeWithClose
