"use client"

import { useEffect, useState } from "react"

const WEDDING_DATE = new Date("2026-11-01T12:00:00+09:00")

export function CountdownSection() {
  const [diff, setDiff] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const ms = WEDDING_DATE.getTime() - now.getTime()
      if (ms <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const totalSeconds = Math.floor(ms / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      setDiff({ days, hours, minutes, seconds })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  if (diff === null) {
    return (
      <section id="countdown" className="bg-white px-6 py-12">
        <div className="text-center">
          <p className="text-sm text-stone-500">로딩 중...</p>
        </div>
      </section>
    )
  }

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <section id="countdown" className="bg-white px-6 py-12">
      <div className="text-center">
        <div className="mb-4 flex justify-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-stone-800 sm:text-3xl">{diff.days}</span>
            <span className="text-xs text-stone-500">일</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-stone-800 sm:text-3xl">{pad(diff.hours)}</span>
            <span className="text-xs text-stone-500">시간</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-stone-800 sm:text-3xl">
              {pad(diff.minutes)}
            </span>
            <span className="text-xs text-stone-500">분</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-stone-800 sm:text-3xl">
              {pad(diff.seconds)}
            </span>
            <span className="text-xs text-stone-500">초</span>
          </div>
        </div>
        <p className="text-sm font-medium text-stone-600">
          {diff.days === 0 && diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0
            ? "오늘입니다"
            : `${diff.days}일 남았습니다`}
        </p>
        <p className="mt-2 text-xs text-stone-500">2026년 11월 1일 일요일 오후 12시</p>
      </div>
    </section>
  )
}
