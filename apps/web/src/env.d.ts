/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

declare module 'spotlight.js/src/js/spotlight.js';
// declare module '@kalmiawoods/ui';
// declare module '@kalmiawoods/database';

// this is a temporary fix for the alpha.6 v-calendar version
declare module 'v-calendar' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  export const SetupCalendar: any;
  export const Calendar: DefineComponent;
  export const DatePicker: DefineComponent;
  export const Popover: DefineComponent;
  export const PopoverRow: DefineComponent;
}

interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly API_BASE_URL: string;
  readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// declare namespace App {
//   interface Locals {
//     user: {
//       fullName: string;
//       role: string;
//     };
//   }
// }
