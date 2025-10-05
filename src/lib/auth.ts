import { db } from '@/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60 * 2, // 60 days - default is 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },

  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  plugins: [nextCookies()]
})
