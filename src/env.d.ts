// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'spotlight.js/src/js/spotlight.js';

interface ImportMetaEnv {
	readonly APP_NAME: string;
	readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
	readonly SITE: string;
	readonly KW_STORAGE_DATABASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		user?: { id: string; email: string; role: 'super_admin' | 'admin' };
	}
}
