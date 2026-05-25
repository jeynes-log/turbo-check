"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { guestbookEntrySchema, type GuestbookFormData } from "@/lib/guestbook-schema"
import { graphemeLength, MESSAGE_MAX } from "@/lib/text"

interface GuestbookFormProps {
  defaultValues?: Partial<GuestbookFormData>
  onSubmit: (data: GuestbookFormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

export function GuestbookForm({ defaultValues, onSubmit, submitLabel }: GuestbookFormProps) {
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
