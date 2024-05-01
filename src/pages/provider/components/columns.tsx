import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { IProvider } from '@/types/provider.interface.ts'
import { providers } from '@/providers/providers.ts'
import { statuses } from '@/pages/provider/data/data.tsx'

function getLogoFileName(providerId: string) {
  return `/images/providers/light/square/${providerId}.svg`
}

export const columns: ColumnDef<IProvider>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label: string = row.original.channel

      return (
        <div className="flex space-x-2 items-center">
          {label && <Badge variant="outline" className={'capitalize'}>{label}</Badge>}
          <img src={getLogoFileName(row.original.providerId ?? '')} alt={'logo provider'} className={'h-4 w-4'} />
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('name')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'identifier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifier" />
    ),
    cell: ({ row }) => {
      return (<div className="w-[100px]">{row.getValue('identifier')}</div>)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'providerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: ({ row }) => {
      const p = providers.find(e => e.id === row.original.providerId)
      return (<div className="w-[80px]">{p?.displayName}</div>)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('active'),
      )

      if (!status) {
        return null
      }

      return (
        <div className={`flex w-[100px] items-center`}>
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 text-muted-foreground`} style={{ color: status.color }} />
          )}
          <span style={{ color: status.color }}>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   accessorKey: 'priority',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Priority' />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue('priority')
  //     )
  //
  //     if (!priority) {
  //       return null
  //     }
  //
  //     return (
  //       <div className='flex items-center'>
  //         {priority.icon && (
  //           <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
