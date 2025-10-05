import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function AdminPage() {
  return (
    <div className='p-8'>
      <Button type='submit' className='' variant='destructive' asChild>
        <Link href='/'>Home Page</Link>
      </Button>
    </div>
  )
}
