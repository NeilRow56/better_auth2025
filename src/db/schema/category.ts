import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
import { posts } from './post'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' })
})

// Each category could have many posts
export const categoryRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}))
