'use client'

import { Package } from 'lucide-react'
import Link from 'next/link'

import { useSession } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { LoadingSwap } from '@/components/shared/loading-swap'

function PublicHeader() {
  const { data: session, isPending } = useSession()
  const user = session?.user

  return (
    <header className='fixed top-0 right-0 left-0 z-50 border-b bg-white'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='rounded-md bg-teal-500 p-2'>
              <Package className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold text-teal-600'>
              Asset Platform
            </span>
          </Link>

          <nav className='ml-6 flex items-center gap-6'>
            <Link
              className='text-sm font-medium hover:text-teal-600'
              href={'/search'}
            >
              Search
            </Link>
            <Link
              className='text-sm font-medium hover:text-teal-600'
              href={'/posts'}
            >
              Posts
            </Link>
            <Link
              className='text-sm font-medium hover:text-teal-600'
              href={'/categories'}
            >
              Categories
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-6'>
          {user ? (
            <div className='flex items-center gap-3'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'ghost'}
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8 border border-slate-300'>
                      <AvatarFallback className='bg-teal-500 text-white'>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className='sapce-y-1 flex flex-col'>
                      <p className='text-sm leading-none font-medium'>
                        {user.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              asChild
              className='bg-teal-500 text-white hover:bg-teal-600'
            >
              <Link href='/auth/login'>
                <LoadingSwap isLoading={isPending}>Sign In</LoadingSwap>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
