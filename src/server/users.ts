'use server'

import { db } from '@/db'
import { user } from '@/db/schema'
import { executeQuery } from '@/db/utils/executeQuery'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUp = async (
  email: string,
  password: string,
  name: string,
  age: number
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        age,
        password
      }
    })

    return {
      success: true,
      message: 'Signed up successfully.'
    }
  } catch (error) {
    const e = error as Error

    return {
      success: false,
      message: e.message || 'An unknown error occurred.'
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true
      }
    })

    return {
      success: true,
      message: 'Signed in successfully.'
    }
  } catch (error) {
    const e = error as Error

    return {
      success: false,
      message: e.message || 'An unknown error occurred.'
    }
  }
}

export const getCurrentUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/auth/login')
  }

  const userId = session.session.userId

  return {
    ...session,
    userId
  }
}

export async function getUserDetails(id: string) {
  const userDetails = await db.select().from(user).where(eq(user.id, id))

  return userDetails[0]
}

export async function getUser(userId: string) {
  return executeQuery({
    queryFn: async () =>
      await db.query.user.findFirst({
        columns: { name: true, email: true, id: true },
        where: eq(user.id, userId)
      }),
    serverErrorMessage: 'getUser',
    isProtected: false
  })
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const sessionUserId = session?.user?.id

  if (!sessionUserId) return null

  return executeQuery({
    queryFn: async () =>
      await db.query.user.findFirst({ where: eq(user.id, sessionUserId) }),
    serverErrorMessage: 'getCurrentUser',
    isProtected: false
  })
}
