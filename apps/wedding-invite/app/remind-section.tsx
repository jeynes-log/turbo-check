"use client"

import { Button } from "@workspace/ui/components/button"
import { BellIcon } from "lucide-react"

export function RemindSection() {
  const handleRemindClick = () => {
    // TODO: Integrate with actual reminder service
    alert("리마인드 메시지 기능은 추후 연동됩니다.")
  }

  return (
    <section id="remind" className="flex w-full flex-col items-center py-12">
      <h2 className="mb-6 text-lg font-bold text-stone-800">알림 설정</h2>
      <div className="mb-8 text-center leading-relaxed text-stone-700 [&_p]:text-base [&_p:last-child]:mb-0">
        <p>소중한 날을 잊지 않도록,</p>
        <p>
          <strong>결혼식 일주일, 하루 전</strong>
        </p>
        <p>리마인드 메세지를 보내드려요.</p>
      </div>
      <Button size="lg" type="button" onClick={handleRemindClick} className="rounded-full">
        <BellIcon className="size-5" />
        리마인드 메세지 받기
      </Button>
    </section>
  )
}
