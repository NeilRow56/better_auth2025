import { auth } from '@/lib/auth'

import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import UsersTable from './_components/users-table'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect('/auth/login')

  return (
    <div className='container mx-auto my-6 px-4'>
      <Link href='/' className='mb-6 inline-flex items-center'>
        <ArrowLeft className='mr-2 size-4' />
        Back to Home
      </Link>

      <UsersTable />
    </div>
  )
}
