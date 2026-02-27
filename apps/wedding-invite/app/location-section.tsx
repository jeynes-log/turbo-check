"use client"

import Image from "next/image"

interface LocationSectionProps {
  venueName: string
  venueAddress: string
  fullAddress: string
  mapSearchQuery: string
  naverMapsUrl: string
  kakaoMapsUrl: string
  tmapUrl: string
}

export function LocationSection({
  venueName,
  fullAddress,
  mapSearchQuery,
  naverMapsUrl,
  kakaoMapsUrl,
  tmapUrl,
}: LocationSectionProps) {
  return (
    <section id="location" className="bg-white px-6 py-12 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <p className="mb-2 text-center text-xs font-medium text-stone-500">LOCATION INFORMATION</p>
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">오시는 길</h2>
      <div className="space-y-4 text-center">
        <p className="text-sm text-stone-700">{fullAddress}</p>
        <p className="text-sm font-medium text-stone-800">{venueName}</p>
      </div>
      <div className="mt-6 space-y-6">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-stone-200">
          <iframe
            title="예식장 위치"
            src={`https://map.naver.com/v5/embed/search/${encodeURIComponent(mapSearchQuery)}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="absolute inset-0 block h-full w-full"
          />
        </div>
        <div className="text-center">
          <p className="mb-2 text-base font-bold text-stone-800">내비게이션</p>
          <p className="mb-4 text-sm text-stone-600">앱을 열어 길 안내를 시작해 보세요.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={tmapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-stone-50"
            >
              <Image
                src="/icons/t_map_icon.svg"
                alt="티맵"
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="text-sm font-medium text-stone-700">티맵</span>
            </a>
            <a
              href={kakaoMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-stone-50"
            >
              <Image
                src="/icons/kakaonavi.png"
                alt="카카오 내비"
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="text-sm font-medium text-stone-700">카카오 내비</span>
            </a>
            <a
              href={naverMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-stone-50"
            >
              <Image
                src="/icons/naver_map_logo.png"
                alt="네이버 지도"
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="text-sm font-medium text-stone-700">네이버 지도</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
