'use server'

import { db } from '@/db'
import { user } from '@/db/schema'
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
