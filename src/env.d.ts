/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client-image" />
declare namespace App {
  interface Locals {
    // auth: import('lucia-auth').AuthRequest;
    user: {
      userId: string;
      email: string;
      isAdmin: boolean;
    };
  }
}

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import('@/lib/lucia').Auth;
  type DatabaseUserAttributes = Omit<import('@prisma/client').AuthUser, 'id'> & {
    email: string;
    email_verified: boolean;
    role: 'USER' | 'ADMIN';
  };
  type DatabaseSessionAttributes = {};
}

declare module 'spotlight.js/src/js/spotlight.js';

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
  readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// images
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.ico' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}
