import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
import compress from 'astro-compress';
import critters from 'astro-critters';
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
import mkcert from 'vite-plugin-mkcert';

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
    autoInstall: true,
    compiler: 'vue3',
  }),
  mkcert(),
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
  compressHTML: true,
  output: 'server',
  adapter: vercel({
    analytics: true,
  }),
  server: {
    host: true,
  },
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

    AstroPWA({
      // mode: 'development',
      base: basePath,
      // base: '/',
      // scope: '/',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kalmia Woods',
        short_name: 'Kalmia Woods',
        background_color: '#bbea69',
        theme_color: '#bbea69',
        description: 'Kalmia Woods Guest Guidebook and Reservation Manager',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      // workbox: {
      //   navigateFallback: '/404',
      //   globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      // },
      // devOptions: {
      //   enabled: true,
      //   navigateFallbackAllowlist: [/^\/404$/],
      //   suppressWarnings: true,
      // },
    }),
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
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
    prefetch(),
    critters({ logger: 2 }),
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
    devOnlyRoutes(),
  ],
  markdown: {},
  vite: {
    logLevel: 'info',
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    build: {
      sourcemap: true,
      copyPublicDir: false,
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
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
});
