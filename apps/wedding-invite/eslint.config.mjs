import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      // import 경로는 항상 절대 경로를 사용
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        {
          allowSameFolder: false,
          rootDir: "apps/wedding-invite",
          prefix: "@",
        },
      ],
    },
  },
])

export default eslintConfig
