// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'virtual:pwa-info' {
	export interface PwaInfo {
		pwaInDevEnvironment: boolean;
		/**
		 * The web manifest will be always here.
		 */
		webManifest: {
			href: string;
			useCredentials: boolean;
			/**
			 * The link tag with or without `crossorigin`:
			 * - `<link rel="manifest" href="<webManifestUrl>" />`.
			 * - `<link rel="manifest" href="<webManifestUrl>" crossorigin="use-credentials" />`.
			 */
			linkTag: string;
		};
		/**
		 * The service worker data will be exposed only if required, that's, will **NOT** be exposed if:
		 * - not using `pwaPluginOptions.injectRegister` with `script` or `inline` values
		 * - if using `pwaPluginOptions.injectRegister` with `auto` (default) and importing any of the virtual modules
		 */
		registerSW?: {
			/**
			 * When this flag is `true` the service worker must be registered via inline script otherwise registered via script with src attribute `registerSW.js` .
			 */
			inline: boolean;
			/**
			 * The path for the inline script: will contain the service worker url.
			 */
			inlinePath: string;
			/**
			 * The path for the src script for `registerSW.js`.
			 */
			registerPath: string;
			/**
			 * The scope for the service worker: only required for `inline: true`.
			 */
			scope: string;
			/**
			 * The type for the service worker: only required for `inline: true`.
			 */
			type: 'classic' | 'module';
			/**
			 * The script tag if `shouldRegisterSW` returns `true`.
			 */
			scriptTag?: string;
		};
	}
	/**
	 * Return the PWA information if available.
	 *
	 * This property will be `undefined` if:
	 * - SSR build
	 * - PWA is disabled: `pwaPluginOptions.disable = true`
	 * - running `Dev Server` and `pwaPluginOptions.devOptions.enabled = false` (default).
	 *
	 * @returns The PWA information.
	 */
	export const pwaInfo: PwaInfo | undefined;
}

declare module 'spotlight.js/src/js/spotlight.js';

// this is a temporary fix for the alpha.6 v-calendar version
declare module 'v-calendar' {
	import { DefineComponent } from 'vue';
	export const SetupCalendar: unknown;
	export const Calendar: DefineComponent;
	export const DatePicker: DefineComponent;
	export const Popover: DefineComponent;
	export const PopoverRow: DefineComponent;
}

interface ImportMetaEnv {
	readonly APP_NAME: string;
	readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
	readonly SITE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
