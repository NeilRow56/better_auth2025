import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields, adminClient } from 'better-auth/client/plugins'
import { auth } from './auth'

import { ac, admin, user } from '@/lib/permissions'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        admin,
        user
      }
    })
  ],
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
