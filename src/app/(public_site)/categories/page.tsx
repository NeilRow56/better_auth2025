import { Suspense } from 'react'

import { getCurrentUserId, getUserDetails } from '@/server/users'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/shared/back-button'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { and, asc, count, eq } from 'drizzle-orm'

import { SkeletonArray } from '@/components/shared/skeleton'
import { SkeletonCustomerCard } from '@/components/shared/skeleton-customer-card'
import { EmptyState } from '@/components/shared/empty-state'

import CategoriesTable from './_components/categories-table'
import { AddCategoryButton } from './_components/add-category-button'

export const metadata = {
  title: 'Categories'
}

export default async function Categories() {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  if (userId) {
    const user = await getUserDetails(userId)

    if (!user) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>User ID #{userId} not found</h2>
          <BackButton
            title='Go Back'
            variant='default'
            className='flex w-[100px]'
          />
        </>
      )
    }

    const data = await getUserCategories(userId)
    type Result = { count: number }
    const dbCount = await db.select({ count: count() }).from(categories)

    const arr: Result[] = dbCount

    const total: number = arr.reduce((sum, result) => sum + result.count, 0)

    if (data.length === 0) {
      return (
        <>
          <div className='mx-auto mt-24 flex max-w-6xl flex-col gap-2'>
            <EmptyState
              title='Categories'
              className='size-10 text-teal-600'
              description='You have no categories yet. Click on the button below to create your first category'
            />

            <div className='mt-12 flex w-full justify-center'>
              <AddCategoryButton user={user} />
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        <div className='container mx-auto max-w-2xl py-10'>
          <Suspense
            fallback={
              <SkeletonArray amount={3}>
                <SkeletonCustomerCard />
              </SkeletonArray>
            }
          >
            <CategoriesTable data={data} total={total} user={user} />
          </Suspense>
        </div>
      </>
    )
  }
}
async function getUserCategories(userId: string) {
  const categoriesByUserId = await db
    .select({
      id: categories.id,
      name: categories.name,
      userId: categories.userId
    })
    .from(categories)
    .where(and(eq(categories.userId, userId)))
    .orderBy(asc(categories.name))

  return categoriesByUserId
}
