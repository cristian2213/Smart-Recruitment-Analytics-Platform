import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'

export function useFormOptions(routeName: string, search?: string) {
  const [options, setOptions] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    setLoading(true)

    fetch(route(routeName, { search: debouncedSearch || '' }))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        setOptions(data)
      })
      .catch((error) => {
        console.error(`Error fetching ${routeName}:`, error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [debouncedSearch, routeName])

  return { options, loading }
}
