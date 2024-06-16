import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'
import { ISubscription } from '@/types/subscription.interface.ts'
import { Link } from 'react-router-dom'

export const columns: ColumnDef<ISubscription>[] = [
  {
    accessorKey: '_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div
      className="w-[120px] overflow-hidden text-ellipsis tracking-wide">{row.getValue('_id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[160px] tracking-wide">{row.getValue('email')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'channelId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.type)?

      return (
        <div className="flex space-x-2">
          {row.original.channelName &&
            <Link to={'/channel'}>
              <Badge variant="outline">{row.original.channelName}</Badge>
            </Link>}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('channelId')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="phone" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.type)?

      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('phone')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'locale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Locale" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('locale')}
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
    cell: ({ row }) => <DataTableRowActions<ISubscription> row={row} />,
  },
]
