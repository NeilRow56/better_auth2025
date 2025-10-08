import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { posts } from '@/db/schema'
import { executeQuery } from '@/db/utils/executeQuery'

export async function getPostById(id: number) {
  return executeQuery({
    queryFn: async () =>
      await db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
          category: true,
          user: {
            columns: { id: true, name: true }
          },
          comments: { with: { user: true } }
        }
      }),
    serverErrorMessage: 'getPostById',
    isProtected: false
  })
}
