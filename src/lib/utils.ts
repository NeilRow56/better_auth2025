import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function wait(duration: number = 0) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
