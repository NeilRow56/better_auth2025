import { db } from '@/db'

import { executeQuery } from '@/db/utils/executeQuery'

export async function getTags() {
  return executeQuery({
    queryFn: async () => await db.query.tags.findMany(),
    serverErrorMessage: 'getTags',
    isProtected: false
  })
}
