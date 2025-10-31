import { toast } from 'sonner';

export function handleHttpErrors(
  errors: Record<string, string>,
  cb?: (key: string, error: string) => void,
) {
  Object.entries(errors).forEach(([key, error]) => {
    if (key !== '0') {
      cb?.(key, error);
    } else {
      toast.error(error);
    }
  });
}
