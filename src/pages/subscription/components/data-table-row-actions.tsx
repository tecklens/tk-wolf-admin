import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RepositoryFactory } from '@/api/repository-factory.ts'
import { throttle } from 'lodash'
import { HttpStatusCode } from 'axios'

const SubscriptionRepository = RepositoryFactory.get('sub')

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

// @ts-ignore
export function DataTableRowActions<TData>({
                                             row,
                                           }: DataTableRowActionsProps<TData>) {
  const del = throttle(async () => {
    console.log( row.getValue('_id'))
    const rsp = await SubscriptionRepository.del({
      subscriptionId: row.getValue('_id')
    })

    if (rsp.status === HttpStatusCode.Ok) {
      console.log('del task ' + row.getValue('_id'))
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
        <DropdownMenuItem onClick={del}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
