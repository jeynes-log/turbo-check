# 청첩장 (Wedding Invite)

모바일 청첩장을 Next.js로 직접 구현한 사이드 프로젝트입니다. 정적인 청첩장 템플릿에 그치지 않고, **인증 없는 방명록(Guestbook)에 안전하게 수정·삭제 권한을 부여하는 방법**을 고민하며 만들었습니다.

**Live Demo**: https://wedding-invite-nu-one.vercel.app

> 위 데모의 이름·연락처·계좌번호는 모두 예시 데이터입니다.

## 왜 만들었나

청첩장 사이트는 방문자가 로그인 없이 글을 남기는 게 자연스러운데, 그럼 "내가 쓴 글을 나만 수정/삭제"하게 만드는 문제가 남습니다. 회원가입을 요구할 수는 없으니, 4자리 비밀번호를 글쓴이가 직접 정하고 그 값으로 수정·삭제 권한을 검증하는 방식을 선택했습니다. 이 프로젝트는 그 흐름을 실제로 API·DB까지 붙여서 끝까지 구현해본 결과물입니다.

## 주요 기능

- **방명록 CRUD**: 이름·메시지·4자리 비밀번호로 작성, 비밀번호 검증 후 수정/삭제
- **커서 기반이 아닌 페이지네이션 목록 조회**: `page`/`limit` 쿼리 파라미터로 목록 페이징 처리
- **예식 정보 섹션**: 캘린더 연동(구글 캘린더 추가), 지도(네이버/카카오맵 연결), D-Day 카운트다운
- **갤러리**: 라이트박스 기반 사진 뷰어
- **폼 검증**: 이름은 한글/영문만, 메시지는 자소 단위 길이 제한(이모지·한글 조합 포함 계산) 등 실사용 엣지케이스 대응

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Server State | TanStack Query |
| Form / Validation | React Hook Form, Zod |
| DB / ORM | Neon (Serverless Postgres), Drizzle ORM |
| Monorepo | Turborepo, pnpm workspaces |

## 아키텍처 메모

- 청첩장 정보(예식 일시·장소 등)는 `app/_data/wedding-info.ts`에 데이터로 분리해, 문구/일정 변경 시 컴포넌트를 건드리지 않도록 구성했습니다.
- 방명록은 Route Handler(`app/api/guestbook`)에서 Zod로 요청을 검증한 뒤 Drizzle ORM으로 Postgres에 반영합니다. 비밀번호는 서버에서만 비교하고 클라이언트로는 절대 돌려주지 않습니다.
- 목록 조회는 TanStack Query로 캐싱하고, 작성/수정/삭제 시 관련 쿼리를 무효화(invalidate)해 화면을 갱신합니다.

## 로컬 실행

```bash
pnpm install
pnpm --filter wedding-invite db:push   # Drizzle 스키마를 DB에 반영
pnpm --filter wedding-invite dev
```

`.env.local`에 Neon 데이터베이스 연결 문자열이 필요합니다.
