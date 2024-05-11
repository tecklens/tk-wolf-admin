import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Button } from '@/components/custom/button.tsx'
import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useEnv } from '@/lib/store/envStore.ts'
import { useToast } from '@/components/ui/use-toast.ts'

export default function AccessKeys() {
  const [show, setShow] = useState(false)
  const { toast } = useToast()
  const { fetchEnv, env, apiKey } = useEnv(state => state)

  useEffect(() => {
    fetchEnv()
  }, [fetchEnv])

  const copyWorkflowIdentifier = (text: string, titleNoti: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: titleNoti,
        })
      })
  }

  return <div className={'flex flex-col space-y-8'}>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="api-key">
        <div>API Key</div>
        <div className={'text-slate-400 text-xs'}>Use this API key to interact with the Novu API</div>
      </Label>
      <div className={'flex items-center space-x-2'}>
        <Input
          id={'api-key'}
          type={show ? 'text' : 'password'}
          placeholder="API KEY"
          className={'min-w-[350px]'}
          disabled
          value={apiKey ?? ''}
        />
        <Button
          variant="outline" size="icon" className={'aspect-square'}
          onClick={() => setShow(!show)}
        >
          {show ? <IconEye size={18} /> : <IconEyeOff size={18} />}
        </Button>
        <Button variant="outline" size="icon" className={'aspect-square'} onClick={() => {
          copyWorkflowIdentifier(apiKey ?? '', 'API Key copied to clipboard')
        }}>
          <IconCopy size={18} />
        </Button>
        <Button type="submit">Regenerate</Button>
      </div>
    </div>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="env-identifier">
        <div>Application Identifier</div>
        <div className={'text-slate-400 text-xs'}>A public key identifier that can be exposed to the client
          applications
        </div>
      </Label>
      <div className={'flex items-center space-x-2'}>
        <Input
          id={'env-identifier'}
          disabled
          type="text"
          placeholder="Application Identifier"
          className={'min-w-[350px]'}
          value={env?.identifier ?? ''}
        />
        <Button variant="outline" size="icon" className={'aspect-square'}
                onClick={() => {
                  copyWorkflowIdentifier(env?.identifier ?? '', 'Application Identifier copied to clipboard')
                }}
        >
          <IconCopy size={18} />
        </Button>
      </div>
    </div>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="api-key">
        <div>Environment ID</div>
        {/*<div className={'text-slate-400 text-xs'}>A public key identifier that can be exposed to the client*/}
        {/*  applications*/}
        {/*</div>*/}
      </Label>
      <div className={'flex items-center space-x-2'}>
        <Input
          id={'env-id'}
          disabled
          type="text"
          placeholder="Environment ID"
          className={'min-w-[350px]'}
          value={env?._id}
        />
        <Button variant="outline" size="icon" className={'aspect-square'}
                onClick={() => {
                  copyWorkflowIdentifier(env?._id ?? '', 'Environment Id copied to clipboard')
                }}
        >
          <IconCopy size={18} />
        </Button>
      </div>
    </div>
  </div>
}
