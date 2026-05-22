"use client"

import { weddingInfo } from "@/app/_data/wedding-info"
import { Button } from "@workspace/ui/components/button"
import { Bus, Car, Plane, SquareParking, Train, TrainFront } from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import { useRef, useState } from "react"

const mapLinks = {
  searchQuery: weddingInfo.venue.address,
  naver: `https://map.naver.com/v5/search/${encodeURIComponent(`${weddingInfo.venue.name} ${weddingInfo.venue.address}`)}`,
  kakao: `https://map.kakao.com/?q=${encodeURIComponent(weddingInfo.venue.address)}`,
} as const

export function LocationSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const venuePositionRef = useRef<naver.maps.LatLng | null>(null)
  const [showReset, setShowReset] = useState(false)
  const [activeTab, setActiveTab] = useState("subway")

  const ZOOM_LEVEL = 16

  const tabs = [
    {
      id: "subway",
      label: "지하철",
      icon: <TrainFront size={16} />,
      lines: ["지하철 2호선 방배역 3번 출구 도보 약 3분", "지하철 7호선 내방역 이용 가능"],
    },
    {
      id: "bus",
      label: "버스",
      icon: <Bus size={16} />,
      lines: ["방배역 · 방배사거리 정류장 하차", "(간선 / 지선 버스 다수 운행)"],
    },
    {
      id: "car",
      label: "자가용",
      icon: <Car size={16} />,
      lines: [
        "네비게이션 검색 : 오드힐하우스",
        "주소 검색 : 서울 서초구 방배로 47",
        "",
        "강남 방면 : 서초대로 → 방배로 진입",
        "사당 방면 : 동작대로 → 방배로 진입",
        "이수 방면 : 방배로 따라 직진",
      ],
    },
    {
      id: "train",
      label: "기차",
      icon: <Train size={16} />,
      lines: [
        "[서울역 이용 시]",
        "지하철 4호선 탑승 → 사당역 환승 →",
        "2호선 방배역 하차",
        "",
        "택시 이용 시 약 25~35분 소요",
      ],
    },
    {
      id: "parking",
      label: "주차",
      icon: <SquareParking size={16} />,
      lines: [
        "건물 내 주차 가능",
        "예식 당일 혼잡할 수 있으니",
        "가급적 대중교통 이용을 권장드립니다",
      ],
    },
    {
      id: "flight",
      label: "항공",
      icon: <Plane size={16} />,
      lines: [
        "[김포공항]",
        "공항철도 탑승 → 홍대입구역 환승 →",
        "2호선 방배역 하차",
        "",
        "[인천공항]",
        "공항철도 탑승 → 서울역 또는 홍대입구역 환승 →",
        "2호선 방배역 하차",
      ],
    },
  ]

  function initMap() {
    if (!mapRef.current) return

    naver.maps.Service.geocode({ query: mapLinks.searchQuery }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) return

      const { x, y } = response.v2.addresses[0]
      const position = new naver.maps.LatLng(parseFloat(y), parseFloat(x))

      const map = new naver.maps.Map(mapRef.current!, { center: position, zoom: ZOOM_LEVEL })
      new naver.maps.Marker({ position, map })

      mapInstanceRef.current = map
      venuePositionRef.current = position

      naver.maps.Event.addListener(map, "idle", () => {
        setShowReset(!map.getBounds().hasPoint(position))
      })
    })
  }

  function handleScriptLoad() {
    naver.maps.onJSContentLoaded = initMap
  }

  function handleReset() {
    mapInstanceRef.current?.setCenter(venuePositionRef.current!)
    mapInstanceRef.current?.setZoom(ZOOM_LEVEL)
  }

  return (
    <section id="location" className="bg-white px-6 py-12 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      <h2 className="mb-6 text-center text-lg font-bold text-stone-800">오시는 길</h2>
      <div className="space-y-1 text-center">
        <p className="text-base font-medium text-stone-800">{weddingInfo.venue.name}</p>
        <p className="text-sm text-stone-700">{weddingInfo.venue.address}</p>
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
          <Button
            variant="outline"
            onClick={() => window.open(mapLinks.naver, "_blank", "noopener,noreferrer")}
            className="flex-1"
          >
            <Image src="/icons/naver-map-icon.svg" alt="" width={16} height={16} />
            네이버 지도
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(mapLinks.kakao, "_blank", "noopener,noreferrer")}
            className="flex-1"
          >
            <Image src="/icons/kakao-map-icon.svg" alt="" width={16} height={16} />
            카카오맵
          </Button>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-transparent bg-stone-800 text-white"
                    : "border-stone-200 bg-stone-50 text-stone-500"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-stone-50 p-4 text-center">
            {tabs
              .find((t) => t.id === activeTab)
              ?.lines.map((line, i) => {
                if (line === "") return <div key={i} className="h-2" />
                if (line.startsWith("[") && line.endsWith("]")) {
                  return (
                    <p key={i} className="text-sm font-semibold text-stone-800">
                      {line.slice(1, -1)}
                    </p>
                  )
                }
                return (
                  <p key={i} className="text-sm text-stone-600">
                    {line}
                  </p>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
