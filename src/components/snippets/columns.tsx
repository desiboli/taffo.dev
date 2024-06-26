import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export const columns: ColumnDef<any, any>[] = [
  {
    id: 'title',
    accessorKey: 'data.title',
    header: 'Title',
    cell: ({ row }) => {
      return (
        <a
          href={`snippets/${row.original.slug}`}
          className="font-bold underline underline-offset-8 hover:no-underline whitespace-nowrap"
        >
          {row.getValue('title')}
        </a>
      )
    },
  },
  {
    accessorKey: 'data.description',
    header: 'Description',
    size: 400,
  },
  {
    id: 'category',
    accessorKey: 'data.category',
    header: 'Category',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'data.pubDate',
    header: 'Published',
    cell: (props) => {
      const date = props.getValue()
      return format(date, 'dd.MM.yyyy')
    },
  },
  {
    accessorKey: 'data.updatedDate',
    header: 'Updated',
    cell: (props) => {
      const date = props.getValue()
      if (!date) return null
      return format(date, 'dd.MM.yyyy')
    },
  },
]
