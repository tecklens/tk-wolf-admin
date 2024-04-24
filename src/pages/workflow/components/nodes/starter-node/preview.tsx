import { IconPlayerPlay } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@/components/ui/tooltip.tsx'

export default function StarterNodePreview({onDragStart}: any) {
  const { theme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`dndnode p-3 border border-dashed ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} rounded-lg cursor-pointer`}
          onDragStart={(event) => onDragStart(event, 'starter')} draggable
        >
          <IconPlayerPlay size={30} color={'#525266'} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Starter</p>
      </TooltipContent>
    </Tooltip>
  )
}