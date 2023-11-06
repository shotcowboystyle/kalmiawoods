// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'spotlight.js/src/js/spotlight.js';

// this is a temporary fix for the alpha.6 v-calendar version
// declare module 'v-calendar' {
// 	import { DefineComponent } from 'vue';
// 	export const SetupCalendar: unknown;
// 	export const Calendar: DefineComponent;
// 	export const DatePicker: DefineComponent;
// 	export const Popover: DefineComponent;
// 	export const PopoverRow: DefineComponent;
// }

interface ImportMetaEnv {
	readonly APP_NAME: string;
	readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
	readonly SITE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
