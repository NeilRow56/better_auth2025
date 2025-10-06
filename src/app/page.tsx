'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BetterAuthActionButton } from './auth/login/_components/better-auth-action-button'
import { authClient, useSession } from '@/lib/auth-client'

export default function Home() {
  const { data: session, isPending: loading } = useSession()

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className='mx-auto my-6 max-w-md px-4'>
      <div className='space-y-6 text-center'>
        {session == null ? (
          <>
            <h1 className='text-3xl font-bold'>Welcome to Our App</h1>
            <Button asChild size='lg'>
              <Link href='/auth/login'>Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className='text-3xl font-bold'>Welcome {session.user.name}!</h1>
            <div className='flex justify-center gap-4'>
              <Button asChild size='lg'>
                <Link href='/admin/settings'>Profile</Link>
              </Button>
              {/* <Button asChild size='lg' variant='outline'>
                <Link href='/organizations'>Organizations</Link>
              </Button> */}
              {/* {hasAdminPermission && (
                <Button variant="outline" asChild size="lg">
                  <Link href="/admin">Admin</Link>
                </Button>
              )} */}
              <BetterAuthActionButton
                size='lg'
                variant='destructive'
                action={() => authClient.signOut()}
              >
                Sign Out
              </BetterAuthActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
