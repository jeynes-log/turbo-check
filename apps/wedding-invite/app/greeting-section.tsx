export function GreetingSection() {
  return (
    <section
      id="greeting"
      className="flex flex-col gap-y-24 bg-white px-6 py-12 text-center shadow-sm"
    >
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

      <div className="space-y-4 text-center text-base leading-relaxed text-stone-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
        <p>김만수 ∙ 이영숙의 장남 철수</p>
        <p>우준식 ∙ 박수진의 장녀 영희</p>
      </div>
    </section>
  )
}
