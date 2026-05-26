"use client"

import { Link2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import Script from "next/script"
import { Button } from "@workspace/ui/components/button"
import { weddingInfo } from "@/app/_data/wedding-info"

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean
      init: (key: string) => void
      Share: {
        sendDefault: (params: {
          objectType: string
          content: {
            title: string
            description: string
            imageUrl: string
            link: { mobileWebUrl: string; webUrl: string }
          }
          buttons: Array<{
            title: string
            link: { mobileWebUrl: string; webUrl: string }
          }>
        }) => void
      }
    }
  }
}

const shareContent = {
  title: "철수 💍 영희 모바일 청첩장",
  description: `${weddingInfo.time} · ${weddingInfo.venue.name}`,
  imageUrl: "", // TODO: OG 이미지 URL 입력
}

export function ShareSection() {
  const handleKakaoLoad = () => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
    if (!window.Kakao || !appKey) return
    if (!window.Kakao.isInitialized()) window.Kakao.init(appKey)
  }

  const handleKakaoShare = () => {
    if (!window.Kakao?.isInitialized()) return
    const url = window.location.href
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: shareContent.title,
        description: shareContent.description,
        imageUrl: shareContent.imageUrl,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: url, webUrl: url } }],
    })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.info("링크가 복사되었습니다.")
    } catch {
      // noop
    }
  }

  return (
    <section id="share" className="bg-white px-6 py-10">
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
        strategy="afterInteractive"
        onLoad={handleKakaoLoad}
      />
      <div className="flex flex-col gap-3">
        <Button variant="outline" size="lg" onClick={handleKakaoShare} className="h-10 gap-2">
          <MessageCircle className="size-5" />
          카카오톡으로 공유하기
        </Button>
        <Button variant="outline" size="lg" onClick={handleCopyLink} className="h-10 gap-2">
          <Link2 className="size-5" />
          청첩장 링크 복사하기
        </Button>
      </div>
    </section>
  )
}
