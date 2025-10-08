import { EllipsisVertical, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SelectPostModel } from '@/zod-schemas/posts'
import { getUserCategories } from '@/server/categories'
import { DeletePostButton } from './delete-post-button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
  rows: SelectPostModel[] | null

  columns: string[]
}
export async function PostsTable({ rows, columns }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect('/auth/login')

  const userId = session.user.id

  const categoriesData = (await getUserCategories(userId)) || []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {(rows || []).map(row => (
          <TableRow key={row.id}>
            <TableCell className='font-medium'>{row.id}</TableCell>
            <TableCell className='font-medium'>{row.title}</TableCell>
            <TableCell className='font-medium'>
              {row.shortDescription}
            </TableCell>
            <TableCell className='font-medium'>
              {
                categoriesData.find(category => category.id === row.categoryId)
                  ?.name
              }
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger>
                  <EllipsisVertical />
                </PopoverTrigger>
                <PopoverContent className='flex w-fit flex-col items-start'>
                  <Button variant='ghost' asChild>
                    <Link href={`/admin/posts/${row.id}`}>
                      <Pencil className='mr-2 h-4 w-4' />
                      Edit
                    </Link>
                  </Button>
                  <Button variant='ghost' asChild>
                    <Link href={`/posts/${row.id}`}>
                      <Eye className='mr-2 h-4 w-4' />
                      View
                    </Link>
                  </Button>
                  <DeletePostButton id={row.id} />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
