"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

interface GallerySectionProps {
  images: { src: string; alt: string }[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  const handleNext = () => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <section id="gallery" className="bg-stone-50 px-6 py-12">
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">웨딩 갤러리</h2>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-4/3 w-full">
          {images.map((image, idx) => (
            <div
              key={image.alt}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                idx === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              )}
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handlePrev}
          aria-label="이전 사진"
          className="absolute top-1/2 left-2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="다음 사진"
          className="absolute top-1/2 right-2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`${idx + 1}번 사진`}
            className={cn(
              "size-2 rounded-full transition-colors",
              idx === currentIndex ? "bg-stone-700" : "bg-stone-300"
            )}
          />
        ))}
      </div>
    </section>
  )
}
