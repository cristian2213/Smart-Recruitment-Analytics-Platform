import { DynamicForm } from '@/components/dynamic-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Editor from '@/components/ui/editor'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type JobFormOptions, type User } from '@/types'
import { Head } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import {
  updateFormInputs as jobInputs,
  updateJobValidation as jobUpdateSchema,
} from './forms'

interface JobProps {
  job: JobFormOptions
  edit?: boolean
  formOptions: {
    recruiters: Pick<User, 'id' | 'name' | 'last_name'>[]
  }
}

export default function Job({ job, edit, formOptions }: JobProps) {
  const [description, setDescription] = useState(job.description || '')

  const breadcrumbs: BreadcrumbItem[] = useMemo(
    () => [
      {
        title: 'Job',
        href: '/dashboard/jobs',
      },
      {
        title: 'Edit',
        href: `/dashboard/jobs/${job.id}/edit`,
      },
    ],
    [job],
  )

  const jobMapped = useMemo(() => {
    return {
      ...job,
      recruiter_id: String(job.recruiter_id),
    }
  }, [job])

  const jobInputsMapped = useMemo(() => {
    return jobInputs.map((input) => {
      if (input.name === 'recruiter_id') {
        return {
          ...input,
          options: formOptions.recruiters.map((recruiter) => ({
            value: String(recruiter.id),
            label: `${recruiter.id}-${recruiter.last_name}`,
          })),
        }
      }
      return input
    })
  }, [formOptions.recruiters])

  const handleSubmit = (data: JobFormOptions) => {
    console.log(data)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job" />

      <div className="gap- flex flex-col gap-4 p-4 lg:max-h-[calc(100vh-5rem)] lg:flex-row lg:px-12 lg:py-8 xl:gap-16">
        <Card className="h-fit overflow-y-auto px-2 py-6 lg:w-[35%] 2xl:px-6 2xl:py-12">
          <CardHeader className="gap-4">
            <CardTitle className="text-center text-3xl">Job Description</CardTitle>
            <CardDescription className="text-lg">
              Enter each field as you wish, remember that these fields are required to
              automate the job application process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicForm
              inputs={jobInputsMapped}
              schema={jobUpdateSchema}
              defaultValues={jobMapped}
              onSubmit={handleSubmit}
              htmlProps={{ className: 'grid grid-cols-2 gap-6' }}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="mx-auto w-2/3 cursor-pointer"
              form="dynamic-form"
            >
              {edit ? 'Update' : 'Create'}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex h-full w-full flex-col overflow-y-auto lg:w-[65%]">
          <Editor
            value={description}
            onChange={setDescription}
            placeholder="Enter job description..."
          />
        </div>
      </div>
    </AppLayout>
  )
}
