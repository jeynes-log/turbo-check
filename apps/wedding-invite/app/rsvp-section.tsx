"use client"

import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

export function RsvpSection() {
  const [name, setName] = useState("")
  const [attending, setAttending] = useState<"attending" | "not-attending" | "">("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [nameError, setNameError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameError("")

    if (!name.trim()) {
      setNameError("이름을 입력해 주세요.")
      return
    }

    if (!attending) {
      setNameError("참석 여부를 선택해 주세요.")
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="rsvp" className="space-y-4 bg-stone-50 px-6 py-12 text-center">
        <p className="text-base text-stone-700">참석 여부를 전달해 주셔서 감사합니다.</p>
      </section>
    )
  }

  return (
    <section id="rsvp" className="space-y-6 bg-stone-50 px-6 py-12">
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">참석 여부</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="rsvp-name" className="text-stone-700">
            이름
          </Label>
          <Input
            id="rsvp-name"
            type="text"
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className={cn(
              "rounded-xl border-stone-200 bg-stone-50",
              nameError && "border-stone-400"
            )}
          />
          {nameError && <p className="text-xs text-stone-600">{nameError}</p>}
        </div>
        <div className="space-y-3">
          <Label className="text-stone-700">참석 여부</Label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="attending"
                value="attending"
                checked={attending === "attending"}
                onChange={() => setAttending("attending")}
                disabled={isLoading}
                className="h-4 w-4 accent-stone-700"
              />
              <span className="text-sm text-stone-800">참석합니다</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="attending"
                value="not-attending"
                checked={attending === "not-attending"}
                onChange={() => setAttending("not-attending")}
                disabled={isLoading}
                className="h-4 w-4 accent-stone-700"
              />
              <span className="text-sm text-stone-800">참석이 어렵습니다</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsvp-message" className="text-stone-700">
            축하 메시지
          </Label>
          <Textarea
            id="rsvp-message"
            rows={3}
            placeholder="전하고 싶은 말씀을 남겨주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="resize-none rounded-xl border-stone-200 bg-stone-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-full bg-stone-700 py-3 text-sm font-medium text-white"
        >
          {isLoading ? "전송 중..." : "작성 완료"}
        </button>
      </form>
    </section>
  )
}
