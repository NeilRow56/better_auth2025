'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'

import { PasswordInput } from './password-input'
import { InputWithLabel } from '@/components/form/input-with-label'
import { LoadingSwap } from '@/components/shared/loading-swap'
import { signUp } from '@/server/users'
import { toast } from 'sonner'
import { NumberInput } from '@/components/form/number-input'

const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Please enter a valid email address!'),
    age: z.number().int(),

    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, {
      message: 'Passwords do not match'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],

    // run if password & confirmPassword are valid
    when(payload) {
      return registerSchema
        .pick({ password: true, confirmPassword: true })
        .safeParse(payload.value).success
    }
  })
type RegisterSchemaType = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export default function SignUpForm({ onSuccess }: RegisterFormProps) {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const { isSubmitting } = form.formState

  async function onSubmit(values: RegisterSchemaType) {
    const { success, message } = await signUp(
      values.email,
      values.password,
      values.name,
      values.age
    )

    if (success) {
      toast.success(`${message as string} `)

      if (onSuccess) {
        onSuccess()
      }
    } else {
      toast.error(message as string)
    }
  }
  return (
    <Card className='overflow-hidden p-0'>
      <CardContent className='flex w-full max-w-sm flex-col gap-6 md:max-w-3xl'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='px-6 pt-6 pb-2 md:px-8 md:pt-8'
          >
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome!</h1>
                <p className='text-muted-foreground text-balance'>
                  Create your account
                </p>
              </div>
              <div className='grid gap-3'>
                <InputWithLabel fieldTitle='Name' nameInSchema='name' />
              </div>
              <div className='grid gap-3'>
                <InputWithLabel
                  fieldTitle='Email'
                  nameInSchema='email'
                  type='email'
                />
              </div>

              <div className='grid gap-3'>
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
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-primary font-bold'>
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-primary font-bold'>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='submit'
                className='w-full cursor-pointer dark:bg-blue-600 dark:text-white'
                disabled={isSubmitting}
              >
                <LoadingSwap isLoading={isSubmitting}>Sign Up</LoadingSwap>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
