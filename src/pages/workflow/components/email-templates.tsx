import { useEffect, useState } from 'react'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { HttpStatusCode } from 'axios'
import { useToast } from '@/components/ui/use-toast.ts'
import { IEmailTemplate } from '@/types/email-template.interface.ts'

const WorkflowRepository = RepositoryFactory.get('wf')

export default function EmailTemplates({ callback }: { callback: (design: string) => void }) {
  const [templates, setTemplates] = useState<IEmailTemplate[]>([])
  const { toast } = useToast()

  useEffect(() => {
    (async function() {
      const rsp = await WorkflowRepository.listEmailTemplate({
        skip: 0,
        limit: 10,
      })

      if (rsp.status === HttpStatusCode.Ok) {
        setTemplates(rsp.data ?? [])
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred when submitting a get templates request',
        })
      }
    })()
  }, [])
  return (
    <div className={'grid grid-cols-3 gap-4'}>
      {templates.map(e => (
        <EmailPreviewItem key={e._id} preview={e.preview} name={e.name} onSelect={() => callback(e.design)} />
      ))}
    </div>
  )
}

function EmailPreviewItem({ preview, name, onSelect }: { preview: string, name: string, onSelect: () => void }) {
  const [style, setStyle] = useState({ display: 'none' })

  return (
    <div className={'aspect-square hover:blur-lg cursor-pointer'} onClick={onSelect}>
      <img src={preview ?? ''} alt={name ?? 'preview email templates'} className={'w-full h-full object-cover'} />
    </div>
  )
}