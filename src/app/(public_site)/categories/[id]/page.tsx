import { notFound } from 'next/navigation'
import { getCategoryPostsCount, getPostsByCategoryId } from './queries'
import { getUserCategories } from '@/server/categories'
import { PostCards } from '@/app/(admin)/admin/_components/post-cards'
import { Pagination } from '@/components/shared/pagination'
import { getCurrentUserId } from '@/server/users'

type Props = { params: { id: string }; searchParams: { page?: string } }

export default async function IndividualCategoryPage(props: Props) {
  const userDetails = await getCurrentUserId()

  const userId = userDetails.userId

  const categoryId = +props.params.id

  const limit = 8
  const page = Number(props.searchParams.page) - 1 || 0

  const [categoryPostsCount, categoryPostsData, categoriesData] =
    await Promise.all([
      getCategoryPostsCount(categoryId),
      getPostsByCategoryId(page, limit, categoryId),
      getUserCategories(userId)
    ])

  if (!categoriesData) notFound()

  const pagesCount = Math.ceil((categoryPostsCount || 0) / limit)

  return (
    <main>
      <h1 className='py-5 text-2xl font-bold'>
        {categoriesData.find(category => category.id === categoryId)?.name}{' '}
        Posts
      </h1>
      <PostCards data={categoryPostsData} />
      <Pagination
        page={page}
        pagesCount={pagesCount}
        urlPrefix={`/categories/${props.params.id}?`}
      />
    </main>
  )
}
