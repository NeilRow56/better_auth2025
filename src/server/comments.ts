'use server'

import { db } from '@/db'
import { comments, CommentSchema, commentSchema } from '@/db/schema/comment'
import { executeAction } from '@/db/utils/executeAction'
import { revalidatePath } from 'next/cache'

export async function createComment(data: CommentSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = commentSchema.parse(data)
      await db.insert(comments).values(validatedData)
      revalidatePath(`/posts/${validatedData.id}`)
    },
    isProtected: true,
    clientSuccessMessage: 'Comment created successfully',
    serverErrorMessage: 'createComment'
  })
}
