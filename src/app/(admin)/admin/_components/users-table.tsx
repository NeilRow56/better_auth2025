import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserRow } from './user-row'

export default async function UsersTable() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect('/auth/login')
  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ['list'] } }
  })
  if (!hasAccess.success) return redirect('/')

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' }
  })
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Users ({users.total})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='w-[100px]'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.users.map(user => (
                  <UserRow key={user.id} user={user} selfId={session.user.id} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
