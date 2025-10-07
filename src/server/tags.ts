import { db } from '@/db'
import { tags } from '@/db/schema'

export async function getTags() {
  const allTags = await db.select().from(tags)

  return allTags
}
