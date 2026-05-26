"use client"

import { useRef, useState } from "react"
import { Pencil, PencilLine, Trash2 } from "lucide-react"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Pagination } from "@workspace/ui/components/pagination"
import type { GuestbookFormData, GuestbookDeleteFormData } from "@/lib/guestbook-schema"
import type { GuestbookEntry } from "@/lib/schema"
import { useGuestbookEntries } from "@/app/guestbook-section/hooks/use-guestbook-entries"
import {
  ApiError,
  useCreateGuestbookEntry,
  useUpdateGuestbookEntry,
  useDeleteGuestbookEntry,
} from "@/app/guestbook-section/hooks/use-guestbook-mutations"
import { GuestbookForm } from "@/app/guestbook-section/form"
import { GuestbookDeleteForm } from "@/app/guestbook-section/delete-form"
import { formatDate } from "@/app/guestbook-section/utils"

export function GuestbookSection() {
  const { page, setPage, data, isLoading } = useGuestbookEntries()
  const createMutation = useCreateGuestbookEntry()
  const updateMutation = useUpdateGuestbookEntry()
  const deleteMutation = useDeleteGuestbookEntry()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<GuestbookEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GuestbookEntry | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const handlePageChange = (p: number) => {
    setPage(p)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleCreate = async (formData: GuestbookFormData): Promise<{ error?: string } | void> => {
    try {
      await createMutation.mutateAsync(formData)
    } catch {
      return { error: "등록에 실패했습니다." }
    }

    setCreateOpen(false)
    if (page !== 1) setPage(1)

    confetti({
      particleCount: 177,
      spread: 111,
      startVelocity: 35,
      origin: { y: 0.7 },
    })

    toast.success("방명록이 등록되었습니다.")
  }

  const handleEdit = async (formData: GuestbookFormData): Promise<{ error?: string } | void> => {
    if (!editTarget) return

    try {
      await updateMutation.mutateAsync({ id: editTarget.id, formData })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return { error: "비밀번호가 틀렸습니다." }
      return { error: "수정에 실패했습니다." }
    }

    setEditTarget(null)
    toast.success("방명록이 수정되었습니다.")
  }

  const handleDelete = async (
    formData: GuestbookDeleteFormData
  ): Promise<{ error?: string } | void> => {
    if (!deleteTarget) return

    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.id, password: formData.password })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return { error: "비밀번호가 틀렸습니다." }
      return { error: "삭제에 실패했습니다." }
    }

    setDeleteTarget(null)

    if (data?.items.length === 1 && page > 1) {
      setPage(page - 1)
    }

    toast.success("방명록이 삭제되었습니다.")
  }

  const items = data?.items ?? []

  return (
    <section ref={sectionRef} id="guestbook" className="flex flex-col bg-white px-6 py-12">
      <h2 className="mb-3 text-center text-lg font-bold text-stone-800">방명록</h2>
      <p className="mb-8 text-center text-sm leading-relaxed text-stone-500">
        축하의 마음을 담은 메시지를 남겨주세요.
        <br />
        소중한 한마디, 오래도록 기억하겠습니다.
      </p>

      <div className="mb-8 flex flex-col gap-y-4">
        <div className="space-y-2">
          {isLoading && !data ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-1 h-3 w-32" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="py-8 text-center text-sm leading-relaxed text-stone-400">
              <p>아직 작성된 방명록이 없어요.</p>
              <p>첫 번째 방명록을 남겨보세요!</p>
            </div>
          ) : (
            items.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-800">{entry.name}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{formatDate(entry.createdAt)}</p>
                  <p className="mt-1.5 text-sm text-stone-600">{entry.message}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setEditTarget(entry)}
                    className="text-stone-300 transition-colors hover:text-stone-500"
                    aria-label="수정"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setDeleteTarget(entry)}
                    className="text-stone-300 transition-colors hover:text-stone-500"
                    aria-label="삭제"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {data && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* 작성 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger
          render={
            <Button
              size="lg"
              className="w-fit self-center rounded-full"
              onClick={() => setCreateOpen(true)}
            >
              <PencilLine className="size-5" /> 방명록 작성하기
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>방명록 작성하기</DialogTitle>
          </DialogHeader>
          <GuestbookForm onSubmit={handleCreate} submitLabel="작성 완료" />
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>방명록 수정하기</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <GuestbookForm
              key={editTarget.id}
              defaultValues={{ name: editTarget.name, message: editTarget.message }}
              onSubmit={handleEdit}
              submitLabel="수정 완료"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>글 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600">비밀번호를 입력하면 글이 삭제됩니다.</p>
          {deleteTarget && <GuestbookDeleteForm key={deleteTarget.id} onSubmit={handleDelete} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}
