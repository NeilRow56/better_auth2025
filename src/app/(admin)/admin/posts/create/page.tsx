import { redirect } from 'next/navigation'

import { PostForm } from '../_components/post-form'
import { getCurrentUserId, getUserDetails } from '@/server/users'
import { getUserCategories } from '@/server/categories'
import { getTags } from '@/server/tags'
import { EmptyState } from '@/components/shared/empty-state'
import { AddCategoryButton } from '../../categories/_components/add-category-button'
import { BackButton } from '@/components/shared/back-button'

export default async function Page() {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  if (userId) {
    const user = await getUserDetails(userId)

    if (!user) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>User ID #{userId} not found</h2>
          <BackButton
            title='Go Back'
            variant='default'
            className='flex w-[100px]'
          />
        </>
      )
    }

    const categoriesData = await getUserCategories(userId)
    const tagsData = await getTags()

    if (!categoriesData || categoriesData.length === 0)
      return (
        <div className='mx-auto mt-24 flex max-w-6xl flex-col gap-2'>
          <EmptyState
            title='Categories'
            className='size-10 text-teal-600'
            description='You need a category for your post. It looks like you do not have any categories yet. Click on the button below to create your first category'
          />

          <div className='mt-12 flex w-full justify-center'>
            <AddCategoryButton user={user} />
          </div>
        </div>
      )

    return (
      <div className='flex-1'>
        <div className='mb-12 flex w-full items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-teal-600'>Create Post</h1>
          </div>
          <AddCategoryButton user={user} />
        </div>
        <main className='max-w-sm space-y-3'>
          {!!categoriesData && (
            <PostForm
              categoriesData={categoriesData}
              tagsData={tagsData}
              defaultValues={{
                mode: 'create',
                title: '',
                shortDescription: '',
                userId: userId,
                categoryId: categoriesData[0].id,
                content: '',
                tagIds: []
              }}
            />
          )}
        </main>
      </div>
    )
  }
}
