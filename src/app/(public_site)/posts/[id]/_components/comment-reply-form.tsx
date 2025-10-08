'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { commentSchema, CommentSchema } from '@/db/schema/comment'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { createComment } from '@/server/comments'

type Props = { defaultValues: CommentSchema }
export function CommentReplyForm({ defaultValues }: Props) {
  const form = useForm<CommentSchema>({
    defaultValues,
    resolver: zodResolver(commentSchema)
  })

  const onSubmit: SubmitHandler<CommentSchema> = async data => {
    const response = await createComment(data)
    if (response.success) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' variant='secondary'>
          {!!defaultValues.parentId ? 'Send Reply' : 'Send Comment'}
        </Button>
      </form>
    </Form>
  )
}
