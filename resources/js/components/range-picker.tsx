import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isEqual } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  from: z.date({ error: 'Please select a start date' }),
  to: z.date({ error: 'Please select a end date' }),
})

type FormValues = z.infer<typeof schema>

interface RangePickerProps {
  onSubmit: (range: { from: Date; to: Date }) => void
}

function RangePicker({ onSubmit }: RangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: undefined,
      to: undefined,
    },
  })

  const from = form.watch('from')
  const to = form.watch('to')

  const formattedRange =
    from && to
      ? `${format(from, 'LLL dd, y')} - ${format(to, 'LLL dd, y')}`
      : from
        ? format(from, 'LLL dd, y')
        : 'Select'

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({ from: data.from, to: data.to })
  })

  return (
    <form
      id="dynamic-form"
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              'w-full justify-between font-normal',
              (form.formState.errors.from || form.formState.errors.to) &&
                'border-red-500',
            )}
          >
            {formattedRange}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from, to }}
            captionLayout="dropdown"
            onSelect={(range) => {
              const from = range?.from
              const to = range?.to
              if (!from || !to) return
              if (isEqual(from, to)) {
                form.setValue('from', from)
                return
              }
              form.setValue('from', from)
              form.setValue('to', to)
            }}
            numberOfMonths={1}
            className="w-full"
            required
          />
        </PopoverContent>
      </Popover>

      {(form.formState.errors.from || form.formState.errors.to) && (
        <div className="text-sm text-red-500">
          {form.formState.errors.from?.message || form.formState.errors.to?.message}
        </div>
      )}
    </form>
  )
}

export { RangePicker }
