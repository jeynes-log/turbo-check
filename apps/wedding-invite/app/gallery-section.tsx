"use client"

import { useState } from "react"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/26965603/pexels-photo-26965603.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 1",
  },
  {
    src: "https://images.pexels.com/photos/13434437/pexels-photo-13434437.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 2",
  },
  {
    src: "https://images.pexels.com/photos/9197335/pexels-photo-9197335.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 3",
  },
  {
    src: "https://images.pexels.com/photos/13434430/pexels-photo-13434430.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 4",
  },
  {
    src: "https://images.pexels.com/photos/20479992/pexels-photo-20479992.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 5",
  },
  {
    src: "https://images.pexels.com/photos/8815274/pexels-photo-8815274.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 6",
  },
  {
    src: "https://images.pexels.com/photos/6679832/pexels-photo-6679832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 7",
  },
  {
    src: "https://images.pexels.com/photos/8815267/pexels-photo-8815267.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 8",
  },
  {
    src: "https://images.pexels.com/photos/8845902/pexels-photo-8845902.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 9",
  },
] as const

export function GallerySection() {
  const [expanded, setExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const needsExpansion = galleryImages.length > 6
  const visibleImages = expanded || !needsExpansion ? galleryImages : galleryImages.slice(0, 6)

  return (
    <section id="gallery" className="bg-stone-50 px-6 py-12">
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">웨딩 갤러리</h2>

      <div className="relative grid grid-cols-3 gap-1">
        {visibleImages.map((img, idx) => (
          <button
            key={img.alt}
            type="button"
            aria-label={img.alt}
            onClick={() => setLightboxIndex(idx)}
            className="relative aspect-square overflow-hidden"
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </button>
        ))}

        {needsExpansion && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-stone-50 to-transparent" />
        )}
      </div>

      {needsExpansion && (
        <div className="mt-4 flex justify-center">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full border border-stone-300 bg-white px-6 py-2 text-sm text-stone-700 shadow-sm"
            >
              더보기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-full border border-stone-300 bg-white px-6 py-2 text-sm text-stone-700 shadow-sm"
            >
              접기
            </button>
          )}
        </div>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={galleryImages.map(({ src, alt }) => ({ src, alt }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      />
    </section>
  )
}
