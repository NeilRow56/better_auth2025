import { PostCards } from '@/app/(admin)/admin/_components/post-cards'
import { Pagination } from '@/components/shared/pagination'
import { getUserPosts, getUserPostsCount } from '@/server/posts'
import { getCurrentUserId, getUser } from '@/server/users'
import { notFound, redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function Page(props: Props) {
  const limit = 8
  const page = (await Number(props.searchParams)) - 1 || 0
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  const [userPostsCount, userPostsData, userData] = await Promise.all([
    getUserPostsCount(userId),
    getUserPosts({ userId, limit, page }),
    getUser(userId)
  ])

  if (!userData) notFound()

  const pagesCount = Math.ceil((userPostsCount || 0) / limit)

  return (
    <main>
      <h1 className='py-5 text-2xl font-bold'>{userData.name} Posts</h1>
      <PostCards data={userPostsData} />
      <Pagination
        page={page}
        pagesCount={pagesCount}
        urlPrefix={`/posts/user/${userId}?`}
      />
    </main>
  )
}
