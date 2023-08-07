import mdx from '@astrojs/mdx';
// import partytown from '@astrojs/partytown';
// import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
// import compress from 'astro-compress';
// import critters from 'astro-critters';
import devOnlyRoutes from 'astro-dev-only-routes';
import icon from 'astro-icon';
import { defineConfig, sharpImageService } from 'astro/config';
import { dirname, resolve } from 'path';
import AutoImport from 'unplugin-auto-import/astro';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
// import mkcert from 'vite-plugin-mkcert';

const { APP_SITE, APP_BASE } = loadEnv(process.env.MODE, process.cwd(), '');
const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}`;
const __dirname = dirname(fileURLToPath(import.meta.url));

const vitePlugins = [
  Components({
    resolvers: [IconsResolver()],
    dts: 'src/components.d.ts',
    directoryAsNamespace: true,
  }),
  Icons({
    // autoInstall: true,
    // compiler: 'vue3',
  }),
];

// https://astro.build/config
export default defineConfig({
  site: APP_SITE,
  base: basePath,
  trailingSlash: 'never',
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // compressHTML: true,
  output: 'server',
  adapter: vercel({
    analytics: true,
  }),
  // server: {
  //   host: true,
  // },
  integrations: [
    vue({
      appEntrypoint: '/src/pages/_app',
    }),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    icon({
      include: {
        ri: ['*'],
        ic: ['outline-outdoor-grill'],
        bi: ['stars'],
        brandico: ['facebook-rect', 'instagram', 'linkedin-rect'],
        'icon-park-outline': ['game-ps', 'camp'],
      },
    }),

    mdx(),
    // partytown({
    //   config: {
    //     forward: ['dataLayer.push'],
    //   },
    // }),
    AutoImport({
      imports: [
        'vue',
        {
          '@vueuse/core': ['useScroll'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/plugins'],
      vueTemplate: true,
    }),
    // prefetch(),
    // critters({ logger: 2 }),
    // compress({
    //   css: false,
    //   html: {
    //     removeAttributeQuotes: false,
    //   },
    //   img: false,
    //   js: true,
    //   svg: false,
    //   logger: 1,
    // }),
    devOnlyRoutes(),

    AstroPWA({
      mode: 'production',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kalmia Woods',
        short_name: 'Kalmia Woods',
        orientation: 'portrait-primary',
        background_color: '#bbea69',
        theme_color: '#bbea69',
        description: 'Kalmia Woods Guest Guidebook and Reservation Manager',
        display: 'standalone',
        start_url: APP_SITE,
        // start_url: '/',
        //   icons: [
        //     {
        //       src: 'apple-touch-icon.png',
        //       sizes: '180x180',
        //       type: 'image/png',
        //     },
        //     {
        //       src: 'apple-touch-icon-152x152-precomposed.png',
        //       sizes: '152x152',
        //       type: 'image/png',
        //     },
        //     {
        //       src: 'android-chrome-512x512.png',
        //       sizes: '512x512',
        //       type: 'image/png',
        //     },
        //     {
        //       src: 'safari-pinned-tab.svg',
        //       sizes: '512x512',
        //       type: 'image/svg+xml',
        //     },
        //     {
        //       src: 'mstile-150x150.png',
        //       sizes: '150x150',
        //       type: 'image/png',
        //     },
        //   ],
        // },
        // workbox: {
        //   navigateFallback: '/404',
        //   // globPatterns: ['**/*.{css,js,html,svg,png,ico,jpg,jpeg,webp,txt,woff,woff2}'],
        //   globPatterns: ['**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,webmanifest,pdf,xml,json,txt,csv}'],
        //   globIgnores: ['**/node_modules/**', '**/dist/**'],
        //   runtimeCaching: [
        //     // {
        //     //   // blog posts Network First (Network Falling Back to Cache). Cache is updated when user visits the page.
        //     //   urlPattern: /^blog\/.*/i,
        //     //   handler: 'NetworkFirst',
        //     //   options: {
        //     //     cacheName: 'blog-cache',
        //     //     expiration: {
        //     //       maxEntries: 1000,
        //     //       maxAgeSeconds: 60 * 60 * 24 // <== 1 day
        //     //     },
        //     //     cacheableResponse: {
        //     //       statuses: [0, 200]
        //     //     }
        //     //   }
        //     // },
        //     // pdf, xml, json, txt, csv, and webmanifest files Network First (Network Falling Back to Cache). Cache is updated when user visits the page.
        //     {
        //       urlPattern: /^.*\.(?:pdf|xml|json|txt|csv|webmanifest)$/i,
        //       handler: 'NetworkFirst',
        //       options: {
        //         cacheName: 'files-cache',
        //         expiration: {
        //           maxEntries: 50,
        //           maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
        //         },
        //       },
        //     },
        //     // cache favicons and images
        //     {
        //       urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|webp)$/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'images-cache',
        //         expiration: {
        //           maxEntries: 100,
        //           maxAgeSeconds: 60 * 60 * 24 * 3, // <== 3 days
        //         },
        //         cacheableResponse: {
        //           statuses: [0, 200],
        //         },
        //       },
        //     },
        //     {
        //       urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'google-fonts-cache',
        //         expiration: {
        //           maxEntries: 10,
        //           maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
        //         },
        //         cacheableResponse: {
        //           statuses: [0, 200],
        //         },
        //       },
        //     },
        //     {
        //       urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'gstatic-fonts-cache',
        //         expiration: {
        //           maxEntries: 10,
        //           maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
        //         },
        //         cacheableResponse: {
        //           statuses: [0, 200],
        //         },
        //       },
        //     },
        //   ],
        //   skipWaiting: true,
        //   clientsClaim: true,
        // },
        // devOptions: {
        //   enabled: true,
        //   navigateFallbackAllowlist: [/^\/404$/],
        // },
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
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/404$/],
      },
      client: {
        installPrompt: true,
        periodicSyncForUpdates: 20,
      },
    }),
    // compress({
    //   html: {
    //     collapseWhitespace: true,
    //     collapseInlineTagWhitespace: true,
    //     conservativeCollapse: true,
    //     removeRedundantAttributes: true,
    //     sortAttributes: true,
    //     sortClassName: true,
    //   },
    // }),
  ],
  markdown: {},
  vite: {
    logLevel: 'info',
    build: {
      // assetsInlineLimit: true,
      // cssCodeSplit: false,
      // rollupOptions: { output: { esModule: false } },
      sourcemap: true,
      // copyPublicDir: false,
    },
    css: {
      devSourcemap: true,
    },
    ssr: {
      external: ['svgo'],
    },
    // server: {
    //   https: true,
    // },
    plugins: vitePlugins,
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'v-calendar'],
    },
    define: {
      'import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
    },
    resolve: {
      dedupe: ['vue'],
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
});
