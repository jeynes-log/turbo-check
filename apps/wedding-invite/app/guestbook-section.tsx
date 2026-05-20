"use client"

import { useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"

interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
}

export function GuestbookSection() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      const newEntry: GuestbookEntry = {
        id: crypto.randomUUID(),
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
      setName("")
      setMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="guestbook" className="bg-white px-6 py-12">
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">방명록</h2>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col space-y-4">
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="rounded-xl border-stone-200 bg-stone-50"
        />
        <Textarea
          placeholder="축하 메시지를 남겨주세요"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          className="resize-none rounded-xl border-stone-200 bg-stone-50"
        />
        <Button size="lg" type="submit" disabled={isSubmitting} className="mx-auto rounded-full">
          {isSubmitting ? "등록 중..." : "방명록 등록하기"}
        </Button>
      </form>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-stone-500">
            아직 남겨주신 축하 메시지가 없습니다.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4"
            >
              <p className="mb-1 text-sm font-medium text-stone-800">{entry.name}</p>
              <p className="text-sm text-stone-600">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
