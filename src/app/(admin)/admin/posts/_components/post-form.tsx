'use client'

import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { InputWithLabel } from '@/components/form/input-with-label'
import { toast } from 'sonner'
import SelectBox from '@/components/form/select-box-with-label'
import { createPost, updatePost } from '@/server/posts'
import { insertPostSchema, postSchema } from '@/zod-schemas/posts'

type Props = {
  defaultValues: insertPostSchema
  categoriesData: { id: number; name: string }[] | null
  tagsData: { id: number; name: string }[] | null
}
export function PostForm({ defaultValues, categoriesData, tagsData }: Props) {
  const router = useRouter()

  const form = useForm<insertPostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues
  })

  const onSubmit: SubmitHandler<insertPostSchema> = async data => {
    let response
    if (data.mode === 'create') {
      response = await createPost(data)
    } else {
      response = await updatePost(data)
    }
    if (response.success) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    router.push('/admin/posts')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <InputWithLabel<insertPostSchema>
          fieldTitle='Title'
          nameInSchema='title'
        />
        <InputWithLabel<insertPostSchema>
          fieldTitle='Short Description'
          nameInSchema='shortDescription'
        />
        <InputWithLabel<insertPostSchema>
          fieldTitle='Content'
          nameInSchema='content'
        />

        <SelectBox
          options={categoriesData}
          control={form.control}
          name='categoryId'
          label='Category'
        />

        <SelectBox
          options={tagsData}
          control={form.control}
          name='tagIds'
          multiple
          label='Tags'
        />

        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
