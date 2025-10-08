'use server'

import { db } from '@/db'
import { posts, postTags } from '@/db/schema'
import { executeAction } from '@/db/utils/executeAction'
import { executeQuery } from '@/db/utils/executeQuery'

import { insertPostSchema, postSchema } from '@/zod-schemas/posts'
import { count, desc, eq, ilike } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createPost(data: insertPostSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = postSchema.parse(data)

      const { postId } = (
        await db
          .insert(posts)
          .values(validatedData)
          .returning({ postId: posts.id })
      )[0]

      if (validatedData.tagIds.length > 0) {
        await db
          .insert(postTags)
          .values(validatedData.tagIds.map(tagId => ({ postId, tagId })))
      }

      revalidatePath('/admin/posts')
    },
    isProtected: true,
    clientSuccessMessage: 'Post created successfully',
    serverErrorMessage: 'createPost'
  })
}

export async function updatePost(data: insertPostSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = postSchema.parse(data)

      if (validatedData.mode === 'edit') {
        await db
          .update(posts)
          .set(validatedData)
          .where(eq(posts.id, +validatedData.id))

        await db.delete(postTags).where(eq(postTags.postId, +validatedData.id))

        await db.insert(postTags).values(
          validatedData.tagIds.map(tagId => ({
            postId: validatedData.id!,
            tagId
          }))
        )
      }

      revalidatePath('/admin/posts')
    },
    isProtected: true,
    clientSuccessMessage: 'Post updated successfully',
    serverErrorMessage: 'updatePost'
  })
}

export async function getRelatedPostsByCategoryId(categoryId: number) {
  return executeQuery({
    queryFn: async () =>
      await db.query.posts.findMany({
        limit: 4,
        where: eq(posts.categoryId, categoryId),
        columns: {
          id: true,
          title: true,
          updatedAt: true,
          shortDescription: true
        }
      }),
    serverErrorMessage: 'getRelatedPostsByCategoryId',
    isProtected: false
  })
}

export async function getPostsCount(searchTerm?: string) {
  return executeQuery({
    queryFn: async () =>
      await db
        .select({ count: count() })
        .from(posts)
        .where(ilike(posts.title, `%${searchTerm || ''}%`))
        .then(res => res[0].count),
    serverErrorMessage: 'getPostsCount',
    isProtected: false
  })
}

export async function getPosts(
  page: number,
  limit: number,
  searchTerm?: string
) {
  return executeQuery({
    queryFn: async () =>
      db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(page * limit)
        .where(ilike(posts.title, `%${searchTerm || ''}%`)),

    serverErrorMessage: 'getPosts',
    isProtected: false
  })
}

export async function getUserPostsCount(userId: string) {
  return executeQuery({
    queryFn: async () =>
      await db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.userId, userId))
        .then(res => res[0].count),
    serverErrorMessage: 'getUserPostsCount',
    isProtected: false
  })
}

export async function getUserPosts({
  limit,
  page,
  userId
}: {
  limit: number
  page: number
  userId: string
}) {
  return executeQuery({
    queryFn: async () =>
      await db.query.posts.findMany({
        where: eq(posts.userId, userId),
        limit,
        offset: limit * page,
        orderBy: [desc(posts.createdAt)]
      }),
    serverErrorMessage: 'getUserPosts',
    isProtected: false
  })
}

export async function deletePostById(id: number) {
  return executeAction({
    actionFn: async () => {
      await db.delete(postTags).where(eq(postTags.postId, id))
      await db.delete(posts).where(eq(posts.id, id))
      revalidatePath('/admin/posts')
    },
    isProtected: true,
    clientSuccessMessage: 'Post deleted successfully',
    serverErrorMessage: 'deletePostById'
  })
}
