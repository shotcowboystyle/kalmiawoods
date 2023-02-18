import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath } from 'url';

import { SITE } from './src/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// https://astro.build/config
export default defineConfig({
  // site: SITE.origin,
  site: 'https://kalmiawoods-client.vercel.app',
  base: '/',
  trailingSlash: 'never',

  output: 'static',

  experimental: {
    integrations: true,
  },

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    vue(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),

    mdx(),

    AstroPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Astro PWA',
        short_name: 'Astro PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallback: '/404',
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      }),
    ),

    prefetch(),
    compress({
      css: false,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  markdown: {},

  vite: {
    ssr: {
      external: ['svgo'],
    },
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    server: { open: true },
    plugins: [Icons({ autoInstall: true, compiler: 'vue3' })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
