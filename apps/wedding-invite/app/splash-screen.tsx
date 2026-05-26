"use client"

import { cn } from "@workspace/ui/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"

const SPLASH_CHARS = [...Array.from("결혼식에 초대합니다 "), "❤️"]
const TYPING_INTERVAL_MS = 150
const AUTO_DISMISS_MS = 114000
const FADE_OUT_MS = 500

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [typedCount, setTypedCount] = useState(0)
  const isDismissing = useRef(false)

  const handleDismiss = useCallback(() => {
    if (isDismissing.current) return
    isDismissing.current = true
    setIsFadingOut(true)
    setTimeout(() => {
      document.documentElement.style.overflow = ""
      window.scrollTo(0, 0)
      setIsVisible(false)
    }, FADE_OUT_MS)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = ""
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      const t = setTimeout(() => setTypedCount(SPLASH_CHARS.length), 0)
      return () => clearTimeout(t)
    }
    let count = 0
    const interval = setInterval(() => {
      count += 1
      setTypedCount(count)
      if (count >= SPLASH_CHARS.length) clearInterval(interval)
    }, TYPING_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(handleDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [handleDismiss])

  if (!isVisible) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="청첩장 열기"
      onClick={handleDismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleDismiss()
      }}
      className={cn(
        "fixed top-0 bottom-0 left-1/2 z-9999 flex w-full max-w-120 -translate-x-1/2 cursor-pointer items-center justify-center bg-[#fcf7f5] transition-opacity duration-500",
        isFadingOut ? "opacity-0" : "opacity-100"
      )}
    >
      <p className="text-center text-2xl font-medium tracking-tight text-rose-700">
        {SPLASH_CHARS.slice(0, typedCount).join("")}
        <span
          aria-hidden
          className="animate-blink ml-0.5 inline-block h-[1.2em] w-[2px] translate-y-[0.1em] bg-stone-600/40"
        />
      </p>
    </div>
  )
}
