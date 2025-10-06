import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { ArrowLeftIcon, Key, Trash2, User } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoadingSuspense } from '@/components/shared/loading-suspense'
import { ProfileUpdateForm } from './_components/profile-update-form'
import { SessionManagement } from './_components/session-management'
import { AccountDeletion } from './_components/account-deletion'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) return redirect('/auth/login')

  return (
    <div className='mx-auto my-12 max-w-4xl px-4'>
      <div className='mb-8'>
        <Link href='/' className='mb-6 inline-flex items-center'>
          <ArrowLeftIcon className='mr-2 size-4' />
          Back to Home
        </Link>
        <div className='mt-12 flex items-center space-x-4'>
          <div className='bg-muted flex size-16 items-center justify-center overflow-hidden rounded-full'>
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt='User Avatar'
                className='object-cover'
              />
            ) : (
              <User className='text-muted-foreground size-8' />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-start justify-between gap-1'>
              <h1 className='text-3xl font-bold'>
                {session.user.name || 'User Profile'}
              </h1>
              <Badge>User Role</Badge>
            </div>
            <p className='text-muted-foreground'>{session.user.email}</p>
          </div>
        </div>
      </div>
      {/*  */}
      <Tabs className='space-y-2' defaultValue='profile'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='profile'>
            <User />
            <span className='max-sm:hidden'>Profile</span>
          </TabsTrigger>

          <TabsTrigger value='sessions'>
            <Key />
            <span className='max-sm:hidden'>Sessions</span>
          </TabsTrigger>

          <TabsTrigger value='danger'>
            <Trash2 />
            <span className='max-sm:hidden'>Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='profile'>
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sessions'>
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value='danger'>
          <Card className='border-destructive border'>
            <CardHeader>
              <CardTitle className='text-destructive'>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function SessionsTab({
  currentSessionToken
}: {
  currentSessionToken: string
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() })

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  )
}
