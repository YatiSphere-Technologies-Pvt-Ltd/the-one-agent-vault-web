/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" makes a production build run on the seeded mock API (demo deployments). */
  readonly VITE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
