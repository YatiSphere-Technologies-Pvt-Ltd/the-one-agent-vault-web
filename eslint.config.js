import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

const uiOnly = "Build screens from @agentvault/ui. Radix, cmdk, sonner and UI internals are only used inside packages/ui.";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/.astro/**",
      "**/routeTree.gen.ts",
      "**/schema.d.ts",
      "**/public/mockServiceWorker.js",
      "kickoff/**",
      "av-ui-kickoff/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    },
  },
  {
    // Everything outside packages/ui goes through the UI package's public API.
    files: ["apps/**/*.{ts,tsx}", "e2e/**/*.ts", "packages/icons/**/*.ts", "packages/api-client/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@radix-ui/*", "radix-ui", "radix-ui/*"], message: uiOnly },
            { group: ["cmdk", "sonner"], message: uiOnly },
            { group: ["@agentvault/ui/src/*", "**/packages/ui/src/**", "**/packages/ui/**"], message: uiOnly },
          ],
        },
      ],
    },
  },
);
