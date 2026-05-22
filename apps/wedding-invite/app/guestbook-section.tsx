"use client"

import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import type { GuestbookEntry } from "@/lib/schema"

const formSchema = z.object({
  name: z.string().min(1, "성함을 입력해 주세요."),
  message: z.string().min(1, "내용을 입력해 주세요.").max(100, "100자 이내로 작성해 주세요."),
  password: z.string().regex(/^\d{4}$/, "4자리 숫자를 입력해 주세요."),
})

type FormData = z.infer<typeof formSchema>

const deleteFormSchema = z.object({
  password: z.string().regex(/^\d{4}$/, "4자리 숫자를 입력해 주세요."),
})

type DeleteFormData = z.infer<typeof deleteFormSchema>

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
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "", password: "", ...defaultValues },
  })
  const messageValue = useWatch({ control: form.control, name: "message", defaultValue: "" })

  const handleSubmitWrapper = async (data: FormData) => {
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
            placeholder="100자 이내로 작성해 주세요."
            rows={4}
            className="resize-none"
            aria-invalid={!!form.formState.errors.message}
          />
          <FieldDescription className="text-right">{messageValue.length}/100</FieldDescription>
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
  onSubmit: (data: DeleteFormData) => Promise<{ error?: string } | void>
}) {
  const form = useForm<DeleteFormData>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: { password: "" },
  })

  const handleSubmitWrapper = async (data: DeleteFormData) => {
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
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<GuestbookEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GuestbookEntry | null>(null)

  useEffect(() => {
    async function loadEntries() {
      try {
        const res = await fetch("/api/guestbook")
        const data = await res.json()
        setEntries(data)
      } catch {}
    }
    loadEntries()
  }, [])

  const handleCreate = async (data: FormData): Promise<{ error?: string } | void> => {
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) return { error: "등록에 실패했습니다." }

    const newEntry: GuestbookEntry = await res.json()

    setEntries((prev) => [newEntry, ...prev])
    setCreateOpen(false)

    confetti({
      particleCount: 177,
      spread: 111,
      startVelocity: 35,
      origin: { y: 0.7 },
    })

    toast.success("방명록이 등록되었습니다.")
  }

  const handleEdit = async (data: FormData): Promise<{ error?: string } | void> => {
    if (!editTarget) return

    const res = await fetch(`/api/guestbook/${editTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.status === 401) return { error: "비밀번호가 틀렸습니다." }
    if (!res.ok) return { error: "수정에 실패했습니다." }

    const updated: GuestbookEntry = await res.json()

    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    setEditTarget(null)
    toast.success("방명록이 수정되었습니다.")
  }

  const handleDelete = async (data: DeleteFormData): Promise<{ error?: string } | void> => {
    if (!deleteTarget) return

    const res = await fetch(`/api/guestbook/${deleteTarget.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: data.password }),
    })

    if (res.status === 401) return { error: "비밀번호가 틀렸습니다." }
    if (!res.ok) return { error: "삭제에 실패했습니다." }

    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success("방명록이 삭제되었습니다.")
  }

  return (
    <section id="guestbook" className="flex flex-col bg-white px-6 py-12">
      <h2 className="mb-3 text-center text-lg font-bold text-stone-800">방명록</h2>
      <p className="mb-8 text-center text-sm leading-relaxed text-stone-500">
        축하의 마음을 담은 메시지를 남겨주세요.
        <br />
        소중한 한마디, 오래도록 기억하겠습니다.
      </p>

      <div className="mb-8 space-y-4">
        {entries.length === 0 ? (
          <div className="py-8 text-center text-sm leading-relaxed text-stone-400">
            <p>아직 작성된 방명록이 없어요.</p>
            <p>첫 번째 방명록을 남겨보세요!</p>
          </div>
        ) : (
          entries.map((entry) => (
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
