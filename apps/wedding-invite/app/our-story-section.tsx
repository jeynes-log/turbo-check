"use client"

import Image from "next/image"

const storyImages = [
  {
    src: "https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "우리의 첫 만남",
  },
  {
    src: "https://images.pexels.com/photos/3292695/pexels-photo-3292695.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "함께한 시간",
  },
]

export function OurStorySection() {
  return (
    <section id="our-story" className="bg-white px-6 py-12">
      <h2 className="mb-8 text-center text-lg font-bold text-stone-800">우리의 소개</h2>
      <div className="space-y-6">
        <div className="space-y-4 text-center text-sm leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
          <p>김만수 ∙ 이영숙의 장남 철수</p>
          <p>우준식 ∙ 박수진의 장녀 영희</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {storyImages.map((img) => (
            <div key={img.alt} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
