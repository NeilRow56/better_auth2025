import { db } from '@/db'
import { posts } from '@/db/schema'
import { executeQuery } from '@/db/utils/executeQuery'
import { count, desc, eq } from 'drizzle-orm'

export async function getCategoryPostsCount(categoryId: number) {
  return executeQuery({
    queryFn: async () =>
      (
        await db
          .select({ count: count() })
          .from(posts)
          .where(eq(posts.categoryId, categoryId))
      )[0].count,
    isProtected: false
  })
}

export async function getPostsByCategoryId(
  page: number,
  limit: number,
  categoryId: number
) {
  return executeQuery({
    queryFn: async () =>
      await db
        .select({
          id: posts.id,
          title: posts.title,
          shortDescription: posts.shortDescription,
          updatedAt: posts.updatedAt
        })
        .from(posts)
        .offset(page * limit)
        .limit(limit)
        .where(eq(posts.categoryId, categoryId))
        .orderBy(desc(posts.createdAt)),

    serverErrorMessage: 'getCategoryPostsCount',
    isProtected: false
  })
}
