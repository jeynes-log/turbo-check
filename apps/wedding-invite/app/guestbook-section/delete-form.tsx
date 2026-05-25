"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { guestbookDeleteSchema, type GuestbookDeleteFormData } from "@/lib/guestbook-schema"

interface GuestbookDeleteFormProps {
  onSubmit: (data: GuestbookDeleteFormData) => Promise<{ error?: string } | void>
}

export function GuestbookDeleteForm({ onSubmit }: GuestbookDeleteFormProps) {
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
