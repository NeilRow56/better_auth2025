import { notFound } from 'next/navigation'

import { PostForm } from '@/app/(admin)/admin/posts/_components/post-form'
import { getUserCategories } from '@/server/categories'
import { getTags } from '@/server/tags'
import { getCurrentUser, getCurrentUserId } from '@/server/users'
import { getPostById } from './queries'

type Props = { params: { id: string } }
export default async function Page({ params }: Props) {
  const currentUser = await getCurrentUserId()
  const userId = currentUser.userId

  const categoriesData = await getUserCategories(userId)
  const currentUserData = await getCurrentUser()
  const tagsData = await getTags()

  const postData = await getPostById(+params.id)

  if (!currentUserData || !postData) notFound()

  if (!categoriesData) return <>No categories found</>

  return (
    <main className='space-y-3'>
      <h1 className='text-2xl'>{postData.title}</h1>

      <PostForm
        categoriesData={categoriesData}
        tagsData={tagsData}
        defaultValues={{
          mode: 'edit',
          tagIds: postData.tags.map(tag => tag.tagId),
          categoryId: postData.categoryId,
          content: postData.content,
          title: postData.title,
          userId: postData.userId,
          id: postData.id,
          shortDescription: postData.shortDescription
        }}
      />
    </main>
  )
}
