"use client"

import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

export function InfoTabSection() {
  const [activeTab, setActiveTab] = useState("tab1")

  const tabs: TabItem[] = [
    {
      id: "tab1",
      label: "예식 안내",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
          <p>• 예식 30분 전까지 입장 부탁드립니다.</p>
          <p>• 주차는 건물 내 주차장을 이용해 주세요.</p>
          <p>• 식사는 하객석에서 함께 하실 수 있습니다.</p>
        </div>
      ),
    },
    {
      id: "tab2",
      label: "주차 안내",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
          <p>• 건물 지하 1~2층 주차장 이용 가능</p>
          <p>• 2시간 무료 주차 제공</p>
        </div>
      ),
    },
    {
      id: "tab3",
      label: "기타",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
          <p>• 화환은 정중히 사양합니다.</p>
          <p>• 축의금은 마음 전하실 곳을 이용해 주세요.</p>
        </div>
      ),
    },
  ]

  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <section id="info-tabs" className="bg-stone-50 px-6 py-12">
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">안내 사항</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id ? "bg-stone-700 text-white" : "bg-white text-stone-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">{activeContent}</div>
    </section>
  )
}
