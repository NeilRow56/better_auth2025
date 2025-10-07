import { z } from 'zod/v4'

import { posts } from '@/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { InferSelectModel } from 'drizzle-orm'

const baseSchema = createInsertSchema(posts, {
  title: schema => schema.min(5, 'Title is required'),
  shortDescription: schema =>
    schema
      .min(1, 'A short description is required')
      .max(255, 'A short description should not exceed 255 characters'),
  userId: schema => schema.min(1),
  categoryId: schema => schema.min(1)
}).pick({
  title: true,
  shortDescription: true,
  userId: true,
  categoryId: true,
  content: true
})

export const postSchema = z.union([
  z.object({
    mode: z.literal('create'),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number())
  }),
  z.object({
    mode: z.literal('edit'),
    id: z.number().min(1),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number())
  })
])

export type insertPostSchema = z.infer<typeof postSchema>
export type SelectPostModel = InferSelectModel<typeof posts>

// export const selectPostSchema = createSelectSchema(posts)

// export type insertPostSchemaType = z.infer<typeof insertPostSchema>
// export type selectPostSchemaType = z.infer<typeof selectPostSchema>
