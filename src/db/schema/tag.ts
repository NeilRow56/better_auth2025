import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { postTags } from './post-tags'

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

export const tagRelations = relations(tags, ({ many }) => ({
  postToTag: many(postTags)
}))
