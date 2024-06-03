import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { LogTrigger } from '../data/schema'
import { format } from 'date-fns'

export const columns: ColumnDef<LogTrigger>[] = [
  {
    accessorKey: '_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[70px] text-ellipsis overflow-hidden">{row.getValue('_id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.type)?

      return (
        <div className="flex space-x-2">
          {row.original.status === 1
            ? <Badge variant="outline" className={'text-green-500 border-green-500'}>DELIVERED</Badge>
            : <Badge variant="destructive">FAILED</Badge>}
        </div>
      )
    },
  },
  {
    accessorKey: 'workflowName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.type)?

      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('workflowName')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'recipient',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('recipient')}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div>{format(row.getValue('createdAt'), 'hh:mm:ss MM/dd/yyyy')}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
