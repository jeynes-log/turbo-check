"use client"

import { Countdown } from "@/app/countdown"
import { weddingInfo } from "@/app/_data/wedding-info"
import { buttonVariants } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { cn } from "@workspace/ui/lib/utils"
import { CalendarPlusIcon } from "lucide-react"

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"]

const ceremony = {
  date: new Date(2026, 10, 1, 12, 0, 0, 0), // 2026-11-01 12:00 (month 0-indexed)
  calendar: {
    title: "김철수 💍 우영희 결혼식",
    location: `${weddingInfo.venue.name} ${weddingInfo.venue.address}`,
  },
} as const

function buildGoogleCalendarUrl(
  date: Date,
  title: string,
  location: string,
  durationHours = 2
): string {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)
  const toGoogleFormat = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGoogleFormat(start)}Z/${toGoogleFormat(end)}Z`,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function formatWeddingDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

export function CeremonyInfoSection() {
  const calendarUrl = buildGoogleCalendarUrl(
    ceremony.date,
    ceremony.calendar.title,
    ceremony.calendar.location
  )

  return (
    <section id="ceremony-info" className="flex flex-col bg-white px-6 py-12">
      <h2 className="mb-8 text-center text-lg font-bold text-stone-800">예식 안내</h2>
      <div className="space-y-1 text-center">
        <p className="text-base text-stone-700">{formatWeddingDate(ceremony.date)}</p>
        <p className="text-base font-medium text-stone-700">{weddingInfo.time}</p>
      </div>

      <Calendar
        mode="single"
        selected={ceremony.date}
        defaultMonth={ceremony.date}
        showOutsideDays={false}
        disabled
        formatters={{ formatWeekdayName: (date) => WEEKDAY_KO[date.getDay()] }}
        className="w-full p-8 [--cell-size:2.5rem]"
        classNames={{
          root: "w-ful",
          months: "flex flex-col w-full",
          month: "flex flex-col gap-4 w-full",
          month_caption: "hidden",
          nav: "hidden",
          table: "w-full border-collapse",
          weekdays: "flex",
          weekday:
            "flex-1 text-center text-xs font-medium text-stone-600 first:text-red-400 last:text-blue-400",
          week: "flex w-full mt-2",
          day: "relative flex-1 flex items-center justify-center p-0 text-center text-sm text-stone-900 first:text-red-500 last:text-blue-500",
          day_button:
            "flex size-10 shrink-0 items-center justify-center rounded-full font-normal text-inherit data-[selected-single=true]:bg-stone-200 data-[selected-single=true]:font-medium data-[selected-single=true]:text-stone-800!",
          outside: "text-stone-300",
          hidden: "invisible",
          disabled: "opacity-100",
        }}
      />

      <Countdown />

      <a
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "lg" }), "mt-6 w-fit self-center rounded-full")}
      >
        <CalendarPlusIcon className="size-5" />
        달력에 추가하기
      </a>
    </section>
  )
}
