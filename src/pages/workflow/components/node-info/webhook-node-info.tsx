import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { useNode } from '@/lib/store/nodeStore.ts'

export default function WebhookNodeInfo() {
  const { theme } = useTheme()
  const { node } = useNode((state) => state)
  return (
    <div
      className={`${node ? 'flex' : 'hidden'} info-container shadow-lg border rounded-lg ${theme === 'dark' ? 'bg-[#13131a]' : 'bg-white'} p-2 
      space-x-3`}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="api-key">
          <div>Title</div>
        </Label>
        <Input id={'api-key'} type="text" placeholder="Webhook user service" className={'min-w-[350px]'} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="api-key">
          <div>Webhook URL</div>
        </Label>
        <Input id={'api-key'} type="text" placeholder="https://" className={'min-w-[350px]'} />
      </div>
    </div>
  )
}