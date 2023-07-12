import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';
import compress from 'astro-compress';
import critters from 'astro-critters';
import devOnlyRoutes from 'astro-dev-only-routes';
import icon from 'astro-icon';
import { defineConfig, sharpImageService } from 'astro/config';
import AutoImport from 'unplugin-auto-import/astro';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

const { APP_SITE, APP_BASE } = loadEnv(process.env.MODE, process.cwd(), '');
const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/`;
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    analytics: true,
    // imageService: true,
  }),
  experimental: {
    assets: true,
  },
  // build: {
  //   excludeMiddleware: false,
  //   split: true,
  // },
  site: APP_SITE,
  base: basePath,
  trailingSlash: 'never',
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
    image({
      service: sharpImageService(),
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
    // ssr: {
    //   external: ['svgo'],
    // },
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    server: {
      https: true,
    },
    plugins: [
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
    ],
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
