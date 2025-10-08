import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast as rawToast } from 'sonner'
import { ZodError } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  let message: string

  if (error instanceof ZodError) {
    message = error.message
  } else if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Unknown error'
  }

  return message
}

export function toast(response: unknown) {
  if (
    typeof response === 'object' &&
    response !== null &&
    response !== undefined
  ) {
    const res = response as { message?: unknown; success?: unknown }

    if (typeof res.message === 'string' && typeof res.success === 'boolean') {
      // rawToast({
      // 	title: res.message,
      // 	variant: res.success === true ? "default" : "destructive",
      // });
      rawToast.warning(res.message)
      return
    }
  }

  if (!!response) {
    rawToast.error('Invalid response')
  }
}

export async function wait(duration: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
