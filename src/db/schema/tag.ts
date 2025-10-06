import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { postTags } from './post-tags'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

export const tagRelations = relations(tags, ({ many }) => ({
  postToTag: many(postTags)
}))

// see post-tags.ts for join table and relations

export const tagSchema = createInsertSchema(tags)
export type TagSchema = z.infer<typeof tagSchema>
