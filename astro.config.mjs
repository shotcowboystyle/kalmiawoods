import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
// import node from '@astrojs/node';
import vue from '@astrojs/vue';
// import { sentryVitePlugin } from '@sentry/vite-plugin';
// import compressor from 'astro-compressor';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { dirname, resolve } from 'path';
import AutoImport from 'unplugin-auto-import/astro';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
// import { prismaClient } from './src/lib/db';

const { APP_SITE, APP_BASE, SENTRY_AUTH_TOKEN, SENTRY_PROJECT, SENTRY_DSN, SENTRY_ORG, DEBUGGING } = loadEnv(
  process.env.MODE,
  process.cwd(),
  '',
);
// const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}`;
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

// if (SENTRY_DSN.length && DEBUGGING !== 'true') {
//   vitePlugins.push(
//     sentryVitePlugin({
//       include: '.',
//       org: SENTRY_ORG,
//       project: SENTRY_PROJECT,
//       authToken: SENTRY_AUTH_TOKEN,
//       sourcemaps: { assets: './dist/**' },
//     }),
//   );
// }

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    analytics: true,
    // imageService: true,
    // excludeFiles: ['.prisma/client/index-browser'],
  }),
  // adapter: node({
  //   mode: 'standalone',
  // }),
  experimental: {
    assets: true,
  },
  build: {
    excludeMiddleware: true,
    // split: true,
  },
  server: {
    host: true,
    // port: 9000,
  },
  site: APP_SITE,
  // base: basePath,
  trailingSlash: 'never',
  integrations: [
    vue({
      appEntrypoint: '/src/pages/_app',
      // reactivityTransform: true,
    }),
    // vue(),
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
    // image({
    //   service: sharpImageService(),
    // }),
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
    // compressor({ gzip: true, brotli: true }),
    // devOnlyRoutes(),
    // prismaClient,
  ],
  markdown: {},
  vite: {
    // build: {
    //   copyPublicDir: false,
    //   // sourcemap: true,
    // },
    // ssr: {
    //   // external: ['svgo'],
    //   external: ['.prisma/client/index-browser'],
    // },
    // define: {
    //   __DATE__: `'${new Date().toISOString()}'`,
    // },
    server: {
      https: true,
      // strictPort: true,
      // hmr: { protocol: 'ws', host: ipv4, port: 5183 }
    },
    plugins: vitePlugins,
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'v-calendar'],
      esbuildOptions: {
        plugins: [nodeExternalsPlugin()],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
});
