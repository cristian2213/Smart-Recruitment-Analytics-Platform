import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deleteEmptyProps(obj: Record<string, unknown>) {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === null || newObj[key] === undefined || newObj[key] === '') {
      delete newObj[key]
    }
  })
  return newObj
}
