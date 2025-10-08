import { db } from '@/db'
import { posts } from '@/db/schema'
import { executeQuery } from '@/db/utils/executeQuery'
import { eq } from 'drizzle-orm'

export async function getPostById(id: number) {
  return executeQuery({
    queryFn: async () =>
      await db.query.posts.findFirst({
        columns: {
          id: true,
          title: true,
          shortDescription: true,
          userId: true,
          categoryId: true,
          content: true
        },
        where: eq(posts.id, id),
        with: { tags: true }
      }),
    serverErrorMessage: 'getPostById'
  })
}
