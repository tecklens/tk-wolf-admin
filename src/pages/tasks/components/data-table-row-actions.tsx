import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskStatus } from '@/types/task.interface.ts'
import { useTask } from '@/lib/store/taskStore.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { get, throttle } from 'lodash'
import { HttpStatusCode } from 'axios'

const TriggerRepository = RepositoryFactory.get('trigger')

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

// @ts-ignore
export function DataTableRowActions<TData>({
                                             row,
                                           }: DataTableRowActionsProps<TData>) {
  const { showError } = useTask()

  const del = throttle(async () => {
    const rsp = await TriggerRepository.delTask(row.getValue('code'))

    if (rsp.status === HttpStatusCode.Ok) {
      console.log('del task ' + row.getValue('code'))
    }
  }, 200)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className={`${row.getValue('status') === TaskStatus.cancel ? 'block' : 'hidden'}`}
          onClick={() => showError(get(row.original, 'errorDetail'))}
        >Show Error</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={del}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
