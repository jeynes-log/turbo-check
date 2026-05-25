import { useCallback, useEffect, useState } from "react"
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
  const [data, setData] = useState<PageData | null>(null)

  const refresh = useCallback(
    async (p?: number) => {
      const target = p ?? page
      try {
        const res = await fetch(`/api/guestbook?page=${target}&limit=${PAGE_SIZE}`)
        if (res.ok) setData(await res.json())
      } catch {}
    },
    [page]
  )

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/guestbook?page=${page}&limit=${PAGE_SIZE}`)
        if (!cancelled && res.ok) setData(await res.json())
      } catch {}
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page])

  return { page, setPage, data, refresh }
}
