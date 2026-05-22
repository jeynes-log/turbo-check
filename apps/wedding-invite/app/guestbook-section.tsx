"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, PencilLine, Trash2 } from "lucide-react"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Pagination } from "@workspace/ui/components/pagination"
import {
  guestbookEntrySchema,
  guestbookDeleteSchema,
  type GuestbookFormData,
  type GuestbookDeleteFormData,
} from "@/lib/guestbook-schema"
import { graphemeLength, MESSAGE_MAX } from "@/lib/text"
import type { GuestbookEntry } from "@/lib/schema"

const PAGE_SIZE = 5

type PageData = {
  items: GuestbookEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function GuestbookForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<GuestbookFormData>
  onSubmit: (data: GuestbookFormData) => Promise<{ error?: string } | void>
  submitLabel: string
}) {
  const form = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookEntrySchema),
    defaultValues: { name: "", message: "", password: "", ...defaultValues },
  })
  const messageValue = useWatch({ control: form.control, name: "message", defaultValue: "" })

  const handleSubmitWrapper = async (data: GuestbookFormData) => {
    const result = await onSubmit(data)
    if (result?.error) {
      form.setError("root", { message: result.error })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmitWrapper)} autoComplete="off">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="gb-name">성함</FieldLabel>
          <Input
            {...form.register("name")}
            id="gb-name"
            autoComplete="off"
            placeholder="작성자 성함을 입력해 주세요."
            aria-invalid={!!form.formState.errors.name}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.message}>
          <FieldLabel htmlFor="gb-message">내용</FieldLabel>
          <Textarea
            {...form.register("message")}
            id="gb-message"
            placeholder={`${MESSAGE_MAX}자 이내로 작성해 주세요.`}
            rows={4}
            className="resize-none"
            aria-invalid={!!form.formState.errors.message}
          />
          <FieldDescription className="text-right">
            {graphemeLength(messageValue)}/{MESSAGE_MAX}
          </FieldDescription>
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
        <Field data-invalid={!!(form.formState.errors.password || form.formState.errors.root)}>
          <FieldLabel htmlFor="gb-password">비밀번호</FieldLabel>
          <Input
            {...form.register("password", { onChange: () => form.clearErrors("root") })}
            id="gb-password"
            type="password"
            autoComplete="new-password"
            inputMode="numeric"
            maxLength={4}
            placeholder="비밀번호를 입력해 주세요. (4자리)"
            aria-invalid={!!(form.formState.errors.password || form.formState.errors.root)}
          />
          <FieldError
            errors={[form.formState.errors.password, form.formState.errors.root].filter(Boolean)}
          />
        </Field>
        <Button
          size="lg"
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-full"
        >
          {form.formState.isSubmitting ? "처리 중..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}

function GuestbookDeleteForm({
  onSubmit,
}: {
  onSubmit: (data: GuestbookDeleteFormData) => Promise<{ error?: string } | void>
}) {
  const form = useForm<GuestbookDeleteFormData>({
    resolver: zodResolver(guestbookDeleteSchema),
    defaultValues: { password: "" },
  })

  const handleSubmitWrapper = async (data: GuestbookDeleteFormData) => {
    const result = await onSubmit(data)
    if (result?.error) form.setError("root", { message: result.error })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmitWrapper)} autoComplete="off">
      <FieldGroup>
        <Field data-invalid={!!(form.formState.errors.password || form.formState.errors.root)}>
          <FieldLabel htmlFor="gb-delete-password">비밀번호</FieldLabel>
          <Input
            {...form.register("password", { onChange: () => form.clearErrors("root") })}
            id="gb-delete-password"
            type="password"
            inputMode="numeric"
            maxLength={4}
            autoComplete="new-password"
            placeholder="4자리 비밀번호"
            aria-invalid={!!(form.formState.errors.password || form.formState.errors.root)}
          />
          <FieldError
            errors={[form.formState.errors.password, form.formState.errors.root].filter(Boolean)}
          />
        </Field>
        <Button
          size="lg"
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-full"
        >
          {form.formState.isSubmitting ? "삭제 중..." : "삭제하기"}
        </Button>
      </FieldGroup>
    </form>
  )
}

export function GuestbookSection() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PageData | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<GuestbookEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GuestbookEntry | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const fetchPage = useCallback(async (p: number) => {
    try {
      const res = await fetch(`/api/guestbook?page=${p}&limit=${PAGE_SIZE}`)
      if (res.ok) setData(await res.json())
    } catch {}
  }, [])

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

  const handlePageChange = (p: number) => {
    setPage(p)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleCreate = async (formData: GuestbookFormData): Promise<{ error?: string } | void> => {
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) return { error: "등록에 실패했습니다." }

    setCreateOpen(false)

    if (page !== 1) {
      setPage(1)
    } else {
      fetchPage(1)
    }

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

    const res = await fetch(`/api/guestbook/${editTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.status === 401) return { error: "비밀번호가 틀렸습니다." }
    if (!res.ok) return { error: "수정에 실패했습니다." }

    setEditTarget(null)
    await fetchPage(page)
    toast.success("방명록이 수정되었습니다.")
  }

  const handleDelete = async (
    formData: GuestbookDeleteFormData
  ): Promise<{ error?: string } | void> => {
    if (!deleteTarget) return

    const res = await fetch(`/api/guestbook/${deleteTarget.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.password }),
    })

    if (res.status === 401) return { error: "비밀번호가 틀렸습니다." }
    if (!res.ok) return { error: "삭제에 실패했습니다." }

    setDeleteTarget(null)

    if (data?.items.length === 1 && page > 1) {
      setPage(page - 1)
    } else {
      await fetchPage(page)
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

      <div className="flex flex-col gap-y-4">
        <div className="space-y-2">
          {items.length === 0 ? (
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
            className="mb-8"
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
