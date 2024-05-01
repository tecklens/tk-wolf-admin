import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { IconBolt, IconX } from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: false,
    label: 'Disabled',
    icon: IconX,
    color: '#404040'
  },
  {
    value: true,
    label: 'Active',
    icon: IconBolt,
    color: '#22c55e'
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]
