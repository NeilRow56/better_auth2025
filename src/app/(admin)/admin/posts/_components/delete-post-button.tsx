'use client'
import { Trash } from 'lucide-react'
import { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { deletePostById } from '@/server/posts'

type Props = { id: number }
export function DeletePostButton({ id }: Props) {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await deletePostById(id)
  }
  return (
    <form onSubmit={onSubmit}>
      <Button variant='destructive' type='submit'>
        <Trash className='mr-2 h-4 w-4' />
        Delete
      </Button>
    </form>
  )
}
