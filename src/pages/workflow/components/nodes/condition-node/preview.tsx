import { useTheme } from '@/components/theme-provider.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { IconSchema } from '@tabler/icons-react'

export default function ConditionNodePreview({ onDragStart }: any) {
  const { theme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`dndnode p-3 border border-dashed ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} rounded-lg cursor-pointer`}
          onDragStart={(event) => onDragStart(event, 'condition')} draggable
        >
          <IconSchema size={30} color={'#525266'} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Conditional</p>
      </TooltipContent>
    </Tooltip>
  )
}