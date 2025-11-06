import { HTTPSuccessRes } from '@/types'
import { toast } from 'sonner'

export function handleHttpErrors(
  errors: Record<string, string>,
  cb?: (key: string, error: string) => void,
) {
  Object.entries(errors).forEach(([key, error]) => {
    if (key !== '0') {
      cb?.(key, error)
    } else {
      toast.error(error)
    }
  })
}

export function handleHttpSuccess(res: HTTPSuccessRes, description?: string) {
  toast.success(
    res?.props?.message || 'Operation successfully completed',
    description ? { description } : undefined,
  )
}
