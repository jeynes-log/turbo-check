import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

function buildRange(current: number, total: number, sibling: number): (number | "...")[] {
  const range: (number | "...")[] = []
  const start = Math.max(2, current - sibling)
  const end = Math.min(total - 1, current + sibling)

  range.push(1)
  if (start > 2) range.push("...")
  for (let i = start; i <= end; i++) range.push(i)
  if (end < total - 1) range.push("...")
  if (total > 1) range.push(total)

  return range
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 2,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const range = buildRange(currentPage, totalPages, siblingCount)

  return (
    <nav
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <ChevronLeft />
      </Button>
      {range.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-stone-400" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={p}
            size="icon-sm"
            variant={p === currentPage ? "default" : "ghost"}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        )
      )}
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
