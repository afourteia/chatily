/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_API_BASE_URL: string;
  VITE_APP_API_SERVER_URL: string;
  VITE_CREDENTIALS_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
