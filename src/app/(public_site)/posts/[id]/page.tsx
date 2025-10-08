import { PostCards } from '@/app/(admin)/admin/_components/post-cards'
import { Pagination } from '@/components/shared/pagination'
import { getPosts, getPostsCount } from '@/server/posts'

type Props = { searchParams: { page?: string } }
export default async function Page(props: Props) {
  const limit = 8

  const page = Number(props.searchParams.page) - 1 || 0

  const [postsCount, postsData] = await Promise.all([
    getPostsCount(),
    getPosts(page, limit)
  ])

  const pagesCount = Math.ceil((postsCount || 0) / limit)

  return (
    <main>
      <h1 className='py-5 text-2xl font-bold'>All Posts</h1>
      <PostCards data={postsData} />
      <Pagination page={page} pagesCount={pagesCount} urlPrefix='/posts?' />
    </main>
  )
}
