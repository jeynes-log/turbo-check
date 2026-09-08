# turbo-check

Turborepo + pnpm workspace 모노레포입니다. 실제 앱은 [`apps/wedding-invite`](./apps/wedding-invite) 하나입니다.

## Workspace 구조

```
apps/
  wedding-invite/   # 실제 서비스 — Next.js 청첩장 (상세 README 참고)
  web/              # create-turbo 기본 템플릿 (미사용 스캐폴드)
packages/
  ui/               # apps 간 공유하는 React 컴포넌트
  eslint-config/    # 공용 ESLint 설정
  typescript-config/# 공용 tsconfig
```

- `apps/wedding-invite`가 이 레포의 실질적인 결과물입니다. 무엇을, 왜 만들었는지는 해당 폴더의 README에 정리해뒀습니다.
- `apps/web`은 `create-turbo`로 워크스페이스를 처음 세팅할 때 생긴 기본 템플릿입니다. 워크스페이스 간 패키지 공유(`@workspace/ui` 등)가 실제로 동작하는지 확인하는 용도로만 남겨뒀고, 별도 기능은 없습니다.

## packages

`packages/ui`는 앱들이 공유하는 컴포넌트를 모아두는 곳이고, `@workspace/ui`로 워크스페이스 내부에서 바로 참조합니다. 지금은 앱이 하나라 크게 체감은 안 되지만, ESLint·TypeScript 설정(`packages/eslint-config`, `packages/typescript-config`)도 같은 방식으로 빼뒀습니다.

## 개발 환경

- Package manager: pnpm (workspace)
- Task runner: Turborepo — `turbo run <script>`로 apps/packages 전체에 스크립트를 병렬 실행
- Git hook: Husky + lint-staged로 커밋 시 Prettier 포맷팅 자동 적용

```bash
pnpm install

# 전체 앱 동시 실행 (dev)
pnpm dev

# 특정 앱만 실행
pnpm --filter wedding-invite dev

# 빌드 / 타입체크 / 린트 (전체)
pnpm build
pnpm check-types
pnpm lint
```

## 각 앱 상세

- [`apps/wedding-invite`](./apps/wedding-invite) — 방명록 CRUD가 포함된 모바일 청첩장 (Next.js, TanStack Query, Drizzle ORM)
