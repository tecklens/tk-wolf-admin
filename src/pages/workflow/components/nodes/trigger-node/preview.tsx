import { IconBolt } from '@tabler/icons-react'
import { useTheme } from '@/components/theme-provider.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

export default function TriggerNodePreview({ onDragStart }: any) {
  const { theme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`dndnode p-3 border border-dashed ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} rounded-lg cursor-pointer`}
          onDragStart={(event) => onDragStart(event, 'trigger')} draggable
        >
          <IconBolt size={30} color={'#525266'} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Trigger</p>
      </TooltipContent>
    </Tooltip>
  )
}