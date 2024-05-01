import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'
import { TaskStatus } from '@/types/task.interface.ts'

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
    value: TaskStatus.backlog,
    label: 'Backlog',
    icon: QuestionMarkCircledIcon,
    color: '#2DCCFF'
  },
  {
    value: TaskStatus.todo,
    label: 'Todo',
    icon: CircleIcon,
    color: '#FCE83A'
  },
  {
    value: TaskStatus.in_process,
    label: 'In Progress',
    icon: StopwatchIcon,
    color: '#FFB302'
  },
  {
    value: TaskStatus.done,
    label: 'Done',
    icon: CheckCircledIcon,
    color: '#408140'
  },
  {
    value: TaskStatus.cancel,
    label: 'Canceled',
    icon: CrossCircledIcon,
    color: '#FF3838'
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
