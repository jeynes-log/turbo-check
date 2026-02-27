import type { Metadata } from "next"
import { Noto_Serif_KR } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@workspace/ui/lib/utils"

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "청첩장 | 김철수 & 우영희",
  description: "두 사람의 이야기가 열리고 있어요. 2026년 11월 1일, 오드힐하우스에서 뵙겠습니다.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={cn(notoSerifKR.variable, "font-sans antialiased")}>{children}</body>
    </html>
  )
}
