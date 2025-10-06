import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: process.env.BETTER_AUTH_URL
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  deleteUser
} = authClient
