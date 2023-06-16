/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'spotlight.js/src/js/spotlight.js';
declare module '@kalmiawoods/ui';
declare module 'astro-spa';

interface ImportMetaEnv {
  readonly API_BASE_URL: string;
  readonly PUBLIC_GRAPHQL_URL: string;
  readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: {
      fullName: string;
      role: string;
    };
  }
}
