import { BankAccountSection } from "@/app/bank-account-section"
import { CeremonyInfoSection } from "@/app/ceremony-info-section"
import { ClosingSection } from "@/app/closing-section"
import { FlowerSection } from "@/app/flower-section"
import { FooterSection } from "@/app/footer-section"
import { ShareSection } from "@/app/share-section"
import { GallerySection } from "@/app/gallery-section"
import { GreetingSection } from "@/app/greeting-section"
import { GuestbookSection } from "@/app/guestbook-section"
import { HeroSection } from "@/app/hero-section"
import { InfoTabSection } from "@/app/info-tab-section"
import { LocationSection } from "@/app/location-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-100/80">
      <main className="mx-auto flex w-full max-w-[480px] flex-col shadow-2xl">
        <HeroSection />
        <GreetingSection />
        <GallerySection />
        <CeremonyInfoSection />
        <LocationSection />
        <InfoTabSection />
        <BankAccountSection />
        <FlowerSection />
        <GuestbookSection />
        <ClosingSection />
        <ShareSection />
        <FooterSection />
      </main>
    </div>
  )
}
