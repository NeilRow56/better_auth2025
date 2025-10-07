import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { SelectPostModel } from '@/db/schema/post'

type Props = {
  data:
    | Pick<SelectPostModel, 'id' | 'title' | 'updatedAt' | 'shortDescription'>[]
    | null
}
export function PostCards({ data }: Props) {
  return (
    <div className='flex flex-wrap gap-3'>
      {data && data?.length > 0 ? (
        <>
          {data.map(post => (
            <Card className='h-72 w-72' key={post.id}>
              <div>
                <CardHeader>
                  <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
                  <CardDescription>
                    <>{new Date(post.updatedAt).toDateString()}</>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='line-clamp-3'>{post.shortDescription}</p>
                </CardContent>
              </div>
              <CardFooter>
                <Button variant='secondary' asChild>
                  <Link href={`/posts/${post.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : (
        <>No posts found</>
      )}
    </div>
  )
}
