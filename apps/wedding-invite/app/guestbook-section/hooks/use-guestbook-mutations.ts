import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GuestbookFormData } from "@/lib/guestbook-schema"
import type { GuestbookEntry } from "@/lib/schema"

export class ApiError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`)
  }
}

export function useCreateGuestbookEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: GuestbookFormData): Promise<GuestbookEntry> => {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new ApiError(res.status)
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guestbook"] }),
  })
}

export function useUpdateGuestbookEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number
      formData: GuestbookFormData
    }): Promise<GuestbookEntry> => {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new ApiError(res.status)
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guestbook"] }),
  })
}

export function useDeleteGuestbookEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, password }: { id: number; password: string }): Promise<void> => {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new ApiError(res.status)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guestbook"] }),
  })
}
