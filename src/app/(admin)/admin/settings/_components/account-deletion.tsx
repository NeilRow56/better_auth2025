'use client'

import { BetterAuthActionButton } from '@/app/auth/login/_components/better-auth-action-button'
import { deleteUser } from '@/lib/auth-client'

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant='destructive'
      className='w-full'
      successMessage='Account deletion initiated. '
      action={() => deleteUser({ callbackURL: '/' })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  )
}
