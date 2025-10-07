import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SelectUserModel } from '@/db/schema/auth-schema'

type Props = {
  data?: Pick<SelectUserModel, 'id' | 'name'>
  href?: string
}
export function UserAvatar({ data, ...props }: Props) {
  const { href = `/posts/user/${data?.id}` } = props

  return (
    <Link href={href}>
      <div className='flex items-center gap-2'>
        <Avatar>
          <AvatarFallback>{data?.name[0]}</AvatarFallback>
        </Avatar>
        <p>{data?.name}</p>
      </div>
    </Link>
  )
}
