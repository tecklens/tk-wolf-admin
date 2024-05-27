import { useCallback } from 'react';
import { useOnViewportChange, Viewport } from 'reactflow'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
const WorkflowRepository = RepositoryFactory.get('wf')

export default function ViewportChangeLogger() {
  const workflow = useWorkflow(state => state.workflow)
  const updateViewPort = (viewport: Viewport) => {
    WorkflowRepository.updateViewport({
      workflowId: workflow?._id,
      ...viewport,
    })
  }

  useOnViewportChange({
    onEnd: updateViewPort,
  });

  return null;
}