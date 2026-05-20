"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import Script from "next/script"
import { useRef, useState } from "react"

interface LocationSectionProps {
  venueName: string
  venueAddress: string
  fullAddress: string
  mapSearchQuery: string
  naverMapsUrl: string
  kakaoMapsUrl: string
}

export function LocationSection({
  venueName,
  fullAddress,
  mapSearchQuery,
  naverMapsUrl,
  kakaoMapsUrl,
}: LocationSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const venuePositionRef = useRef<naver.maps.LatLng | null>(null)
  const [showReset, setShowReset] = useState(false)

  function initMap() {
    if (!mapRef.current) return
    naver.maps.Service.geocode({ query: mapSearchQuery }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) return
      const { x, y } = response.v2.addresses[0]
      const position = new naver.maps.LatLng(parseFloat(y), parseFloat(x))
      const map = new naver.maps.Map(mapRef.current!, { center: position, zoom: 17 })
      new naver.maps.Marker({ position, map })
      mapInstanceRef.current = map
      venuePositionRef.current = position
      naver.maps.Event.addListener(map, 'idle', () => {
        setShowReset(!map.getBounds().hasPoint(position))
      })
    })
  }

  function handleScriptLoad() {
    naver.maps.onJSContentLoaded = initMap
  }

  function handleReset() {
    mapInstanceRef.current?.setCenter(venuePositionRef.current!)
    mapInstanceRef.current?.setZoom(17)
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
          {showReset && (
            <button
              onClick={handleReset}
              className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-md"
            >
              📍 결혼식장 보기
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href={naverMapsUrl} target="_blank" rel="noopener noreferrer">
              네이버 지도
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={kakaoMapsUrl} target="_blank" rel="noopener noreferrer">
              카카오맵
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
