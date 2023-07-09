import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';
// import AstroPWA from '@vite-pwa/astro';
import compress from 'astro-compress';
import critters from 'astro-critters';
import devOnlyRoutes from 'astro-dev-only-routes';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'path';
import AutoImport from 'unplugin-auto-import/astro';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
// import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

const { APP_HOST, APP_PORT, APP_SITE, APP_BASE } = loadEnv(process.env.MODE, process.cwd(), '');
const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/`;
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  server: {
    host: APP_HOST,
    port: +APP_PORT,
  },
  site: APP_SITE,
  base: basePath,
  trailingSlash: 'never',
  adapter: vercel(),
  integrations: [
    vue({}),
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
    // AstroPWA({
    //   registerType: 'autoUpdate',
    //   base: basePath,
    //   includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'Manila Observatory - Panahon',
    //     short_name: 'MO - Panahon',
    //     background_color: '#ffffff',
    //     description: 'Manila Observatory - Panahon website',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: `${basePath}resources/static/img/logo/android-chrome-192x192.png`,
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: `${basePath}resources/static/img/logo/android-chrome-512x512.png`,
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //       {
    //         src: `${basePath}resources/static/img/logo/android-chrome-512x512.png`,
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable',
    //       },
    //     ],
    //   },
    // }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
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
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
    prefetch(),
    critters(),
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
    build: {
      copyPublicDir: false,
    },
    ssr: {
      external: ['svgo'],
    },
    // define: {
    //   __DATE__: `'${new Date().toISOString()}'`,
    // },
    server: {
      open: true,
      https: true,
    },
    plugins: [
      Components({
        resolvers: [
          // HeadlessUiResolver(),
          IconsResolver(),
          // (componentName) => {
          //   // where `componentName` is always CapitalCase
          //   if (componentName.startsWith('VueScheduler'))
          //     return { name: componentName.slice(3), from: 'v-calendar-scheduler' };
          // },
        ],

        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
      mkcert(),
    ],
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'v-calendar'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '~': resolve(__dirname, './src'),
      },
    },
  },
});
