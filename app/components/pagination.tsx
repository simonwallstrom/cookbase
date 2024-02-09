import { useSearchParams } from '@remix-run/react'
import { Link } from '~/components/link'
import { PAGINATE_BY } from '~/lib/constants'

export function Pagination({
  totalCount,
  currentPage,
}: {
  currentPage: number
  totalCount: number
}) {
  const take = PAGINATE_BY
  const totalPages = totalCount / take

  const [params] = useSearchParams()
  params.delete('page')
  const query = params.toString()
  const baseUrl = query ? `?${query}&page=` : '?page='

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <div className="text-gray-600 dark:text-gray-400">
        Showing {(currentPage - 1) * take + 1}-
        {currentPage < totalPages ? currentPage * take : totalCount} of {totalCount} recipes
      </div>
      <div className="flex gap-4">
        <div>
          {currentPage > 1 ? (
            <Link prefetch="intent" to={`${baseUrl}${currentPage - 1}`}>
              ← Prev
            </Link>
          ) : (
            <span className="cursor-not-allowed select-none text-gray-400 dark:text-gray-600">
              ← Prev
            </span>
          )}
        </div>
        <div>
          {currentPage < totalPages ? (
            <Link prefetch="intent" to={`${baseUrl}${currentPage + 1}`}>
              Next →
            </Link>
          ) : (
            <span className="cursor-not-allowed select-none text-gray-400 dark:text-gray-600">
              Next →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
