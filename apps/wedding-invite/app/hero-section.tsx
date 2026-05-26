import { weddingInfo } from "@/app/_data/wedding-info"
import Image from "next/image"

const heroContent = {
  imageSrc:
    "https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=1600",
  date: "2026. 11. 01 (일)",
} as const

export function HeroSection() {
  return (
    <section id="hero" className="relative w-full">
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <Image
          src={heroContent.imageSrc}
          alt="두 사람의 추억이 담긴 사진"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="bg-stone-100/80 px-6 py-12">
        <h1 className="mb-4 text-center text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl">
          김철수 💍 우영희
        </h1>
        <p className="text-center text-sm text-stone-600">
          {heroContent.date} {weddingInfo.time} / {weddingInfo.venue.name}
        </p>
      </div>
    </section>
  )
}
