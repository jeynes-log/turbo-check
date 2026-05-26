"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    const mainEl = document.querySelector("main")

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      const progress = max > 0 ? scrollTop / max : 0

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
        barRef.current.style.opacity = mainEl && mainEl.getBoundingClientRect().top <= 0 ? "1" : "0"
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-1/2 z-50 h-1.5 w-full max-w-120 origin-left -translate-x-1/2 bg-pink-400/60 transition-opacity duration-300"
      style={{ transform: "scaleX(0)", opacity: 0 }}
    />
  )
}
