/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE?: string;
  readonly PUBLIC_BASE?: string;
  /** GitHub OAuth App client id (public) — enables one-click login. */
  readonly PUBLIC_GITHUB_CLIENT_ID?: string;
  /** GitHub repo in "owner/name" form, used to build contribution links. */
  readonly PUBLIC_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __PROMPTS__: any[];
}
