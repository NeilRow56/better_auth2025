import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { posts } from './post'

import { tags } from './tag'
import { relations } from 'drizzle-orm'

export const postTags = pgTable(
  'post_to_tag',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),

    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id)
  },
  table => [primaryKey({ columns: [table.postId, table.tagId] })]
)

// A junction table allows us to deal with the scenarios where a post can have many tags and a rag can have many posts

export const postTagsRelations = relations(postTags, ({ one }) => ({
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
  post: one(posts, { fields: [postTags.postId], references: [posts.id] })
}))
