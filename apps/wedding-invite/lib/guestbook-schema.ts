import { z } from "zod"
import { graphemeLength, MESSAGE_MAX } from "@/lib/text"

export const guestbookEntrySchema = z.object({
  name: z.string().min(1, "성함을 입력해 주세요."),
  message: z
    .string()
    .min(1, "내용을 입력해 주세요.")
    .refine((v) => graphemeLength(v) <= MESSAGE_MAX, `${MESSAGE_MAX}자 이내로 작성해 주세요.`),
  password: z.string().regex(/^\d{4}$/, "4자리 숫자를 입력해 주세요."),
})

export const guestbookDeleteSchema = z.object({
  password: z.string().regex(/^\d{4}$/, "4자리 숫자를 입력해 주세요."),
})

export type GuestbookFormData = z.infer<typeof guestbookEntrySchema>
export type GuestbookDeleteFormData = z.infer<typeof guestbookDeleteSchema>
