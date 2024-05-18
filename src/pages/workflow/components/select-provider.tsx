import { useProvider } from '@/lib/store/providerStore.ts'
import { useCallback, useEffect } from 'react'
import { useWorkflow } from '@/lib/store/workflowStore.ts'
import { IconCheck } from '@tabler/icons-react'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { IProvider } from '@/types/provider.interface.ts'
import { HttpStatusCode } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'
import { Button } from '@/components/custom/button.tsx'
import { Link } from 'react-router-dom'

const WorkflowRepository = RepositoryFactory.get('wf')

function getLogoFileName(providerId: string) {
  return `/images/providers/light/square/${providerId}.svg`
}

export default function SelectProvider({ onSuccess }: { onSuccess: (id: string, pId: string, pNam: string) => void }) {
  const { providersSelectNode, fetchProviderNode } = useProvider()
  const selectingProvider = useWorkflow(state => state.selectingProvider)
  const { toast } = useToast()

  const fetchData = useCallback(() => {
    if (selectingProvider.open && selectingProvider.channel) {
      fetchProviderNode({ channel: selectingProvider.channel, active: true })
    }
  }, [fetchProviderNode, selectingProvider])

  const setProviderNode = useCallback(async (e: IProvider) => {
    if (!selectingProvider.nodeId) return
    const rsp = await WorkflowRepository.setProviderNode({
      id: selectingProvider.nodeId,
      providerId: e._id,
      providerName: e.name,
    })

    if (rsp.status === HttpStatusCode.Created) {
      onSuccess(selectingProvider.nodeId ?? '', e._id, e.name)
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred when submitting a select provider request',
      })
    }
  }, [selectingProvider?.nodeId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className={`my-3 flex flex-col space-y-3`}>
      {providersSelectNode && providersSelectNode.length > 0
        ? providersSelectNode.map(e => {
          return (
            <div
              key={e._id}
              className={'border rounded-lg p-2 inline-flex items-center w-full cursor-pointer light:bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 active:bg-slate-200 dark:hover:bg-slate-700 space-x-3'}
              onClick={() => setProviderNode(e)}
            >
              <div>
                <img src={getLogoFileName(e.providerId ?? '')} alt={'logo provider'} className={'h-8 w-8'} />
              </div>
              <div className={'flex flex-col flex-1'}>
                <div>{e.name}</div>
                <div className={'text-xs text-slate-500'}>Provider identifier: {e.identifier}</div>
              </div>

              <div>
                <div className={'rounded-full border-green-500 border aspect-square'}>
                  <IconCheck className={'text-green-500'} size={18} />
                </div>
              </div>
            </div>
          )
        })
        : <div>
          <Link to={'/provider'}>
            <Button>Create Provider</Button>
          </Link>
        </div>}
    </div>
  )
}