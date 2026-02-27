import { BankAccountSection } from "@/app/bank-account-section"
import { CeremonyInfoSection } from "@/app/ceremony-info-section"
import { CountdownSection } from "@/app/countdown-section"
import { FlowerSection } from "@/app/flower-section"
import { GallerySection } from "@/app/gallery-section"
import { GuestbookSection } from "@/app/guestbook-section"
import { InfoTabSection } from "@/app/info-tab-section"
import { LocationSection } from "@/app/location-section"
import { OurStorySection } from "@/app/our-story-section"
import { RemindSection } from "@/app/remind-section"
import { RsvpSection } from "@/app/rsvp-section"
import Image from "next/image"

const weddingDateAsDate = new Date(2026, 10, 1, 12, 0, 0, 0) // 2026-11-01 12:00 (month 0-indexed)

const weddingDate = "2026. 11. 01 (일)"

const weddingTime = "오후 12시"

const weddingVenueName = "오드힐하우스"

const weddingVenueAddress = "서울 서초구 방배로 47"

const weddingVenueFullAddress = "서울 서초구 방배로 47, 오드힐하우스"

const bankAccounts = {
  groom: [
    { name: "[신랑] 김철수", bank: "경남은행", account: "123-456-789012" },
    { name: "홍상문", bank: "국민은행", account: "123-456-789013" },
    { name: "김영숙", bank: "신한은행", account: "110-123-456789" },
  ],
  bride: [
    { name: "[신부] 우영희", bank: "경남은행", account: "123-456-789014" },
    { name: "이정호", bank: "국민은행", account: "123-456-789015" },
    { name: "박수진", bank: "신한은행", account: "110-123-456790" },
  ],
}

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 1",
  },
  {
    src: "https://images.pexels.com/photos/3491999/pexels-photo-3491999.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 2",
  },
  {
    src: "https://images.pexels.com/photos/1646730/pexels-photo-1646730.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 3",
  },
  {
    src: "https://images.pexels.com/photos/160743/wedding-bridal-bouquet-bouquet-roses-160743.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 4",
  },
  {
    src: "https://images.pexels.com/photos/3292695/pexels-photo-3292695.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 5",
  },
  {
    src: "https://images.pexels.com/photos/1267380/pexels-photo-1267380.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "웨딩 사진 6",
  },
]

const heroImageSrc =
  "https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=1600"

const mapSearchQuery = "서울 서초구 방배로 47"

const naverMapsUrl = `https://map.naver.com/v5/search/${encodeURIComponent(mapSearchQuery)}`

const kakaoMapsUrl = `https://map.kakao.com/?q=${encodeURIComponent(mapSearchQuery)}`

const tmapUrl = `https://www.tmap.co.kr/tmap2/mobile/route.jsp?goalname=${encodeURIComponent(weddingVenueName + " " + weddingVenueAddress)}`

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-100/80">
      <main className="mx-auto flex w-full max-w-[480px] flex-col">
        <HeroSection />
        <GreetingSection />
        <RemindSection />
        <RsvpSection />
        <GuestbookSection />
        <InfoTabSection />
        <OurStorySection />
        <CeremonyInfoSection
          weddingDate={weddingDateAsDate}
          weddingTime={weddingTime}
          venueName={weddingVenueName}
          venueAddress={weddingVenueAddress}
          calendarEventTitle="김철수 & 우영희 결혼식"
          calendarEventLocation={`${weddingVenueName} ${weddingVenueAddress}`}
        />
        <CountdownSection />
        <LocationSection
          venueName={weddingVenueName}
          venueAddress={weddingVenueAddress}
          fullAddress={weddingVenueFullAddress}
          mapSearchQuery={mapSearchQuery}
          naverMapsUrl={naverMapsUrl}
          kakaoMapsUrl={kakaoMapsUrl}
          tmapUrl={tmapUrl}
        />
        <GallerySection images={galleryImages} />
        <BankAccountSection groomAccounts={bankAccounts.groom} brideAccounts={bankAccounts.bride} />
        <FlowerSection />
        <ClosingSection />
        <FooterSection />
      </main>
    </div>
  )
}

function HeroSection() {
  return (
    <section id="hero" className="relative w-full">
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <Image
          src={heroImageSrc}
          alt="두 사람의 추억이 담긴 사진"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="rounded-b-[2rem] bg-stone-100/80 px-6 py-12">
        <h1 className="mb-4 text-center text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl">
          김철수 & 우영희
        </h1>
        <p className="text-center text-sm text-stone-600">
          {weddingDate} {weddingTime} / {weddingVenueName}
        </p>
      </div>
    </section>
  )
}

function GreetingSection() {
  return (
    <section id="greeting" className="bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto max-w-md text-base leading-[1.8] text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
        <p>저희 두 사람이 오랜 인연 끝에</p>
        <p>사랑으로 한 마음이 되어</p>
        <p>결혼이라는 아름다운 결실을 맺게 되었습니다.</p>
        <p>&nbsp;</p>
        <p>서로를 아끼고 존중하며</p>
        <p>늘 처음의 마음으로 함께하겠습니다.</p>
        <p>&nbsp;</p>
        <p>믿음과 사랑으로 약속하는 이 자리에</p>
        <p>소중한 발걸음으로 축복해 주신다면</p>
        <p>
          <strong>큰 기쁨과 감사로 간직하겠습니다.</strong>
        </p>
      </div>
    </section>
  )
}

function ClosingSection() {
  return (
    <section id="closing" className="bg-stone-50 px-6 py-12 text-center">
      <p className="text-base leading-relaxed text-stone-700">
        저희 두 사람의 새로운 시작을 축복해주세요.
      </p>
    </section>
  )
}

function FooterSection() {
  return (
    <section id="footer" className="border-t border-stone-200 bg-white px-6 py-10 text-center">
      <p className="text-xs text-stone-400">With love, 철수 &amp; 영희</p>
      <p className="mt-4 text-[10px] text-stone-400">Powered by Bonneyajou.com</p>
    </section>
  )
}
