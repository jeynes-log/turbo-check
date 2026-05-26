import { useCallback, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { GuestbookEntry } from "@/lib/schema"

const PAGE_SIZE = 5

type PageData = {
  items: GuestbookEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useGuestbookEntries() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PageData>({
    queryKey: ["guestbook", page],
    queryFn: async () => {
      const res = await fetch(`/api/guestbook?page=${page}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error("failed to fetch guestbook")
      return res.json()
    },
  })

  const refresh = useCallback(
    (p?: number) => queryClient.invalidateQueries({ queryKey: ["guestbook", p ?? page] }),
    [queryClient, page]
  )

  return { page, setPage, data, refresh, isLoading }
}
