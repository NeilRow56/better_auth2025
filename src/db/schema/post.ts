import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
import { categories } from './category'
import { relations } from 'drizzle-orm'
import { postTags } from './post-tags'
import { comments } from './comment'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  title: varchar('title', { length: 255 }).notNull(),
  shortDescription: text('short_description'),
  content: text('content').notNull(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})

export const postRelations = relations(posts, ({ one, many }) => ({
  // Each post has one user/creator
  user: one(user, {
    fields: [posts.userId],
    references: [user.id]
  }),
  // Each post can have many tags and many comments, but only one category
  tags: many(postTags),
  comments: many(comments),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  })
}))
