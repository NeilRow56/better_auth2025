import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default async function PostsPage() {
  return (
    <main className='space-y-3'>
      <h1 className='text-2xl'>Posts</h1>
      <Button className='mb-3' asChild>
        <Link href='/admin/posts/create'>Create Post</Link>
      </Button>
    </main>
  )
}
