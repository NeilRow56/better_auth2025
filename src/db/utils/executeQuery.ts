import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type Options<T> = {
  queryFn: {
    (): Promise<T>
  }
  serverErrorMessage?: string
  isProtected?: boolean
}

export async function executeQuery<T>({
  queryFn,
  serverErrorMessage = 'Error executing query',
  isProtected = true
}: Options<T>) {
  try {
    if (isProtected) {
      const session = await auth.api.getSession({ headers: await headers() })

      if (session == null) throw new Error('Not authorized')
    }
    return await queryFn()
  } catch (error) {
    console.error(serverErrorMessage, error)
    return null
  }
}
