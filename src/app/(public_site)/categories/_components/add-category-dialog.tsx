import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

import { useForm } from 'react-hook-form'

import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAction } from 'next-safe-action/hooks'

import { InputWithLabel } from '@/components/form/input-with-label'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { User } from '@/db/schema/auth-schema'
import { saveCategoryAction } from '@/server/categories'
import {
  insertCategorySchema,
  insertCategorySchemaType
} from '@/zod-schemas/categories'
import { Category } from '../columns'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  user: User // You must have a user to start a customer - so it is not optional
  category?: Category
}

function AddCategoryDialog({ setOpen, open, category, user }: Props) {
  // const searchParams = useSearchParams()
  const router = useRouter()
  const hasCategoryId = category?.id

  const emptyValues: insertCategorySchemaType = {
    id: 0,
    name: '',
    userId: user.id ?? ''
  }

  const defaultValues: insertCategorySchemaType = hasCategoryId
    ? {
        id: category?.id ?? 0,
        name: category?.name ?? '',
        userId: user.id ?? ''
      }
    : emptyValues

  const form = useForm<insertCategorySchemaType>({
    resolver: zodResolver(insertCategorySchema),
    mode: 'onBlur',
    defaultValues
  })

  useEffect(() => {
    if (category) {
      form.setValue('id', category.id)
      form.setValue('name', category.name)
    }
  }, [category, form])

  const {
    execute: executeSave,
    // result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveCategoryAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(
          `Category ${category ? 'updated ' : 'added'} successfully`
        )
        router.refresh()
        setOpen(false)
        form.reset()
      }
    },

    onError({ error }) {
      console.log(error)

      toast.error(
        `Failed to ${category ? 'update' : 'add'} category. Category may already exist`
      )
    }
  })

  async function submitForm(data: insertCategorySchemaType) {
    executeSave(data)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className='items-center justify-center'>
                <h2 className='text-primary text-xl font-bold lg:text-3xl'>
                  {category?.id ? 'Edit' : 'New'} Category{' '}
                  {category?.id ? `#${category.id}` : 'Form'}
                </h2>
              </div>
            </DialogTitle>

            <DialogDescription>
              Create or edit categories here. Click save when you&apos;re done.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitForm)}
                className='space-y-1'
              >
                {/* <FormField
                  control={form.control}
                  name='userId'
                  render={({ field }) => (
                    <FormItem className='hidden'>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <InputWithLabel<insertCategorySchemaType>
                  fieldTitle='Name'
                  nameInSchema='name'
                />

                <div className='mt-4 flex justify-between'>
                  <Button
                    type='submit'
                    className='w-1/4'
                    variant='default'
                    title='Save'
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle className='animate-spin' /> Saving
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>

                  <Button
                    type='button'
                    className='mr-4 w-1/4'
                    variant='destructive'
                    title='Reset'
                    onClick={() => {
                      form.reset(defaultValues)
                      resetSaveAction()
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddCategoryDialog
