"use client"

import { BellIcon } from "lucide-react"

export function RemindSection() {
  const handleRemindClick = () => {
    // TODO: Integrate with actual reminder service
    alert("리마인드 메시지 기능은 추후 연동됩니다.")
  }

  return (
    <section id="remind" className="w-full py-12 shadow-sm">
      <div className="text-center">
        <p className="mb-[2px] text-sm font-bold text-stone-800">REMIND</p>
        <h2 className="mb-16 text-xl font-bold text-stone-800 sm:text-2xl">알림설정</h2>
        <div className="mb-8 text-center leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
          <p>소중한 날을 잊지 않도록,</p>
          <p>
            <strong>결혼식 일주일, 하루 전</strong>
          </p>
          <p>리마인드 메세지를 보내드려요.</p>
        </div>
        <button
          type="button"
          onClick={handleRemindClick}
          className="inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-700 px-4 py-2.5 text-sm text-white opacity-90 transition-opacity hover:opacity-100"
        >
          <BellIcon className="size-5" />
          리마인드 메세지 받기
        </button>
      </div>
    </section>
  )
}
