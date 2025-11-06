import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { type Link } from '@/types'
import { useForm } from '@inertiajs/react'

interface DataTablePaginationProps {
  links: Link[]
}

function DataTablePagination({ links }: DataTablePaginationProps) {
  const { get } = useForm()

  const handlePageChange = (link: Link) => link?.url && get(link.url)

  const renderLinks = () => {
    const copyLinks = [...links]
    const prevLink = copyLinks.shift() as Link
    const prevLinkNode = (
      <PaginationItem key="prev">
        <PaginationPrevious
          className={!prevLink?.page ? 'cursor-not-allowed' : ''}
          onClick={() => handlePageChange(prevLink)}
        />
      </PaginationItem>
    )
    const nextLink = copyLinks.pop() as Link
    const nextLinkNode = (
      <PaginationItem key="next">
        <PaginationNext
          className={!nextLink?.page ? 'cursor-not-allowed' : ''}
          onClick={() => handlePageChange(nextLink)}
        />
      </PaginationItem>
    )

    const renderedLinks = []
    const totalLinks = copyLinks.length
    const activeIndex = copyLinks.findIndex((link) => link.active)

    if (totalLinks === 0) {
      return [prevLinkNode, nextLinkNode]
    }

    // always add prevBtn and first link
    renderedLinks.push(prevLinkNode)
    const firstLink = copyLinks[0]
    renderedLinks.push(
      <PaginationItem key={firstLink.label}>
        <PaginationLink
          isActive={firstLink.active}
          onClick={() => handlePageChange(firstLink)}
        >
          {firstLink.label}
        </PaginationLink>
      </PaginationItem>,
    )

    // Add left ellipsis if needed
    if (activeIndex > 2) {
      renderedLinks.push(
        <PaginationItem key="ellipsis-left">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Add middle links
    const from = Math.max(1, activeIndex - 1)
    const to = Math.min(totalLinks - 2, activeIndex + 1)
    for (let i = from; i <= to; i++) {
      const link = copyLinks[i]
      renderedLinks.push(
        <PaginationItem key={link.label}>
          <PaginationLink isActive={link.active} onClick={() => handlePageChange(link)}>
            {link.label}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Add right ellipsis if needed
    if (activeIndex < totalLinks - 3) {
      renderedLinks.push(
        <PaginationItem key="ellipsis-right">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than 1 page
    if (totalLinks > 1) {
      renderedLinks.push(
        <PaginationItem key={totalLinks}>
          <PaginationLink
            isActive={copyLinks[totalLinks - 1]?.active}
            onClick={() => handlePageChange(copyLinks[totalLinks - 1])}
          >
            {copyLinks[totalLinks - 1]?.label}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    renderedLinks.push(nextLinkNode)
    return renderedLinks
  }

  return (
    <Pagination>
      <PaginationContent>{renderLinks()}</PaginationContent>
    </Pagination>
  )
}

export { DataTablePagination }

export type { DataTablePaginationProps }
