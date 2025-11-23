import Editor from '@/components/ui/editor'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type Job } from '@/types'
import { Head } from '@inertiajs/react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Job',
    href: '/dashboard/jobs/job',
  },
]

interface JobProps {
  job: Job
}

export default function Job({ job }: JobProps) {
  const [description, setDescription] = useState(job.description || '')

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 px-4 py-5 md:min-h-min dark:border-sidebar-border">
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
