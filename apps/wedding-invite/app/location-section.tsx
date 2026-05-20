"use client"

import Image from "next/image"
import Script from "next/script"
import { useRef } from "react"

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
  const mapRef = useRef<HTMLDivElement>(null)

  function initMap() {
    if (!mapRef.current) return
    naver.maps.Service.geocode({ query: mapSearchQuery }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) return
      const { x, y } = response.v2.addresses[0]
      const position = new naver.maps.LatLng(parseFloat(y), parseFloat(x))
      const map = new naver.maps.Map(mapRef.current!, { center: position, zoom: 17 })
      new naver.maps.Marker({ position, map })
    })
  }

  function handleScriptLoad() {
    naver.maps.onJSContentLoaded = initMap
  }

  return (
    <section id="location" className="bg-white px-6 py-12 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <p className="mb-2 text-center text-xs font-medium text-stone-500">LOCATION INFORMATION</p>
      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">오시는 길</h2>
      <div className="space-y-4 text-center">
        <p className="text-sm text-stone-700">{fullAddress}</p>
        <p className="text-sm font-medium text-stone-800">{venueName}</p>
      </div>
      <div className="mt-6 space-y-6">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-stone-200">
          <div ref={mapRef} className="absolute inset-0 h-full w-full" />
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
