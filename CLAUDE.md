# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

pnpm + Turborepo 기반 모노레포. 현재 주요 앱은 `apps/wedding-invite` (Next.js 16 청첩장 웹앱)이며, 공유 UI 패키지 `packages/ui`에 의존한다.

## 개발 명령어

루트에서 전체 실행:

```bash
pnpm dev                                        # 전체 앱 개발 서버
pnpm build                                      # 전체 빌드
pnpm lint                                       # 전체 린트
pnpm check-types                                # 전체 타입 체크
pnpm format                                     # Prettier 포맷
```

특정 앱만 실행:

```bash
pnpm turbo dev --filter=wedding-invite
pnpm turbo build --filter=wedding-invite
pnpm turbo lint --filter=wedding-invite
```

## 아키텍처

### wedding-invite 앱

**데이터 관리 패턴**: 콘텐츠 상수는 두 곳에 나뉜다.

- **여러 섹션이 공유하는 값** (날짜 시간, 장소명, 주소): `app/_data/wedding-info.ts`에 단일 출처로 관리. 수정 시 이 파일을 먼저 확인.
- **단일 섹션에서만 쓰이는 값** (갤러리 이미지, 계좌번호, 지도 URL 등): 해당 섹션 파일(`*-section.tsx`) 상단의 파일 스코프 상수로 관리. props로 전달하지 않는다.

**컴포넌트 구조**: `app/page.tsx`가 진입점이며, 모든 섹션(`*-section.tsx`)을 import해 조합하는 역할만 한다. 인라인 컴포넌트는 없다. 인터랙션이 있는 섹션은 파일 상단에 `"use client"` 지시어가 있다.

**미완성 기능**:

- `RsvpSection`: 실제 서버 전송 없음
- `RemindSection`: 실제 알림 서비스 미연동 (`// TODO` 주석 있음)

### 데이터베이스

Drizzle ORM + Neon(PostgreSQL) 사용. 스키마는 `apps/wedding-invite/lib/schema.ts`, DB 클라이언트는 `apps/wedding-invite/lib/db.ts`에 있다.

환경변수 (`apps/wedding-invite/.env.local`):

```text
DATABASE_URL=...   # Neon 연결 문자열
```

### 서버 상태 관리 (TanStack Query)

`@tanstack/react-query` v5 사용. `app/providers.tsx`의 `Providers` 컴포넌트가 `QueryClientProvider`를 포함하며, `app/layout.tsx`에서 `<body>` 전체를 감싼다. 새 클라이언트 Provider가 필요하면 이 파일에 추가한다.

패턴:

- **조회**: `useQuery`, queryKey는 `["리소스명", ...파라미터]` 형태. e.g. `["guestbook", page]`
- **변이**: `useMutation`, `mutationFn`에서 비정상 응답 시 `ApiError(res.status)` throw. `onSuccess`에서 `invalidateQueries`로 캐시 무효화. 컴포넌트 핸들러는 `try/catch`로 `ApiError.status`를 분기해 폼 에러 반환.
- **훅 위치**: 조회는 `hooks/use-*-entries.ts`, 변이는 `hooks/use-*-mutations.ts`로 분리.

### 공유 UI 패키지 (`@workspace/ui`)

shadcn 기반 컴포넌트 라이브러리. 현재 제공 컴포넌트: `Button`, `Calendar`, `Input`, `Label`, `Skeleton`, `Textarea`. `packages/ui/src/` 디렉토리에서 직접 확인 가능하다.

임포트 경로:

```ts
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
```

## 환경변수

`apps/wedding-invite/.env.local`에 설정:

```text
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=...   # 네이버 지도 API 클라이언트 ID
NEXT_PUBLIC_KAKAO_APP_KEY=...          # 카카오 JavaScript 키 (https://developers.kakao.com 앱 등록)
```

네이버 지도 미설정 시 `LocationSection`의 지도가 표시되지 않는다.

카카오 앱 키 미설정 시 `ShareSection`의 카카오톡 전달 버튼이 동작하지 않는다 (링크 복사 버튼은 정상 동작).

## 코드 스타일

MD 파일 작성 시 markdownlint 규칙을 준수한다 (예: 리스트 앞뒤 빈 줄, 코드블록 앞뒤 빈 줄, 언어 명시 등). MD013(줄 길이)은 `.markdownlint.json`에서 비활성화되어 있다.

함수 내에서 논리적으로 다른 단계(파싱 → 검증 → DB 작업 → 응답 등)는 빈 줄로 구분해 가독성을 높인다.

```ts
export async function POST(req: Request) {
  const { name, message, password } = await req.json()

  if (!name?.trim() || !message?.trim() || !/^\d{4}$/.test(password)) {
    return Response.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 })
  }

  const [entry] = await db
    .insert(guestbook)
    .values({ name: name.trim(), message: message.trim(), password })
    .returning()

  return Response.json(entry, { status: 201 })
}
```

`apps/**`의 React 컴포넌트 props는 named interface로 정의한다. 네이밍은 `{ComponentName}Props`. inline object type이나 `type` alias 대신 `interface`를 쓴다. `packages/ui/`(shadcn)는 예외. props가 없는 컴포넌트는 빈 interface를 만들지 않는다.

```ts
// ❌
export function GuestbookForm({ onSubmit }: { onSubmit: () => void }) {}

// ✅
interface GuestbookFormProps {
  onSubmit: () => void
}
export function GuestbookForm({ onSubmit }: GuestbookFormProps) {}
```

## 스타일링

Tailwind CSS v4 사용. 전체 색상 테마는 `stone` 계열로 통일되어 있다. 전역 스타일은 `app/globals.css`에서 `@workspace/ui`의 스타일을 임포트하고 폰트(`Noto Serif KR`)를 적용한다.
