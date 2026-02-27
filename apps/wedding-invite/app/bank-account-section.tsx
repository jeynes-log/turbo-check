"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface BankAccountEntry {
  name: string
  bank: string
  account: string
}

interface BankAccountSectionProps {
  groomAccounts: BankAccountEntry[]
  brideAccounts: BankAccountEntry[]
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function BankAccountSection({ groomAccounts, brideAccounts }: BankAccountSectionProps) {
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom")
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleCopy = async (account: string, id: string) => {
    const ok = await copyToClipboard(account.replace(/-/g, ""))
    if (ok) {
      setCopiedIndex(id)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const accounts = activeTab === "groom" ? groomAccounts : brideAccounts
  const prefix = activeTab === "groom" ? "groom" : "bride"

  return (
    <section
      id="bank-account"
      className="bg-white px-6 py-12 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
    >
      <p className="mb-2 text-center text-xs font-medium text-stone-500">ACCOUNT INFORMATION</p>
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">마음 전하실 곳</h2>
      <div className="mb-6 space-y-2 text-center text-sm text-stone-700">
        <p>비대면으로 축하를 전하고자</p>
        <p>하시는 분들을 위해 기재하였습니다.</p>
        <p>너그러운 마음으로 양해 부탁드립니다.</p>
      </div>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("groom")}
          className={cn(
            "flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
            activeTab === "groom"
              ? "bg-white text-stone-800 shadow-sm"
              : "bg-stone-100 text-stone-600"
          )}
        >
          신랑측
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bride")}
          className={cn(
            "flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
            activeTab === "bride"
              ? "bg-white text-stone-800 shadow-sm"
              : "bg-stone-100 text-stone-600"
          )}
        >
          신부측
        </button>
      </div>
      <div className="space-y-3">
        {accounts.map((entry, idx) => {
          const id = `${prefix}-${idx}`
          return (
            <div
              key={id}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50/80 p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleCopy(entry.account, id)}
                aria-label="계좌번호 복사"
                className="shrink-0 text-stone-500 hover:text-stone-700"
              >
                {copiedIndex === id ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <CopyIcon className="size-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{entry.name}</p>
                <p className="mt-0.5 text-sm text-stone-600">
                  {entry.account} / {entry.bank}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
