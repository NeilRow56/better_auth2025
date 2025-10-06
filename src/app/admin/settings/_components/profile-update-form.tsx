'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { toast } from 'sonner'

import { useRouter } from 'next/navigation'
import { NumberInput } from '@/components/form/number-input'
import { LoadingSwap } from '@/components/shared/loading-swap'
import { updateUser } from '@/lib/auth-client'

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  age: z.number().int()
})

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>

export function ProfileUpdateForm({
  user
}: {
  user: {
    email: string
    name: string
    age: number
  }
}) {
  const router = useRouter()
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user
  })

  const { isSubmitting } = form.formState

  async function handleProfileUpdate(data: ProfileUpdateForm) {
    const promises = [
      updateUser({
        name: data.name,
        age: data.age
      })
    ]

    const res = await Promise.all(promises)

    const updateUserResult = res[0]

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || 'Failed to update profile')
    } else {
      toast.success('Profile updated successfully')

      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handleProfileUpdate)}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='age'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
