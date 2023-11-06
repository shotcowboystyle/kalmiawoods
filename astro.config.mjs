import prefetch from '@astrojs/prefetch';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';
import compress from 'astro-compress';
import compressor from 'astro-compressor';
// import critters from 'astro-critters';
import devOnlyRoutes from 'astro-dev-only-routes';
// import purgecss from 'astro-purgecss';
import svgSprite from 'astro-svg-sprite';
import { defineConfig } from 'astro/config';
import analyze from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/astro';
import Components from 'unplugin-vue-components/vite';
import AstroPWA from '@vite-pwa/astro';
import { loadEnv } from 'vite';

import { manifest, workbox } from './pwa.config';

const IS_PROD = process.env.NODE_ENV === 'production';

const { APP_SITE, APP_BASE, APP_HOST } = loadEnv(process.env.MODE, process.cwd(), '');
const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}`;

const vitePlugins = [
	Components({
		dts: 'src/components.d.ts',
		directoryAsNamespace: true,
	}),
	IS_PROD && analyze(),
	IS_PROD &&
	visualizer({
		open: false,
		filename: 'stats.html',
		gzipSize: true,
		brotliSize: true,
	}),
];

// https://astro.build/config
export default defineConfig({
	site: APP_SITE,
	base: basePath,
	trailingSlash: 'never',
	// experimental: {
	// 	devOverlay: true,
	// },
	output: 'server',
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
		speedInsights: {
			enabled: true,
		},
		imagesConfig: {
			sizes: [640, 750, 828, 1080, 1200],
			formats: ['image/avif', 'image/webp'],
			domains: [],
		},
		imageService: true,
		devImageService: 'sharp',
		edgeMiddleware: false,
	}),
	image: {
		domains: [APP_HOST],
	},
	integrations: [
		svgSprite(),
		vue({
			appEntrypoint: '/src/pages/_app',
			template: {
				compilerOptions: {
					// treat any tag that starts with ion- as custom elements
					isCustomElement: (tag) => tag.startsWith('kw-'),
				},
			},
		}),
		tailwind({
			applyBaseStyles: false,
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
		prefetch({
			throttle: 4
		}),
		// critters({
		// 	Logger: 2,
		// 	exclude: ['index.html', (file: string) => file === './dist/index.html']
		// }),
		compressor(),
		compress({
			CSS: true,
			HTML: {
				removeAttributeQuotes: false,
			},
			Image: false,
			JavaScript: true,
			SVG: true,
			Logger: 1,
		}),
		AstroPWA({
			experimental: { directoryAndTrailingSlashHandler: true },
			mode: 'production',
			base: '/dashboard',
			scope: '/dashboard',
			includeAssets: ['favicon.ico', 'icons/apple-touch-icon.png', 'favicon.svg'],
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			manifest,
			workbox,
			client: {
				installPrompt: true,
				periodicSyncForUpdates: 20,
			},
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\/404$/]
			}
		}),
		devOnlyRoutes(),
	],
	vite: {
		logLevel: 'info',
		build: {
			sourcemap: true,
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: (id) => {
						if (id.includes('v-calendar')) {
							return 'v-calendar';
						}

						if (id.includes('leaflet')) {
							return 'leaflet';
						}

						if (id.includes('spotlight.js')) {
							return 'spotlight';
						}
					},
				},
			},
		},
		css: {
			devSourcemap: true,
		},
		ssr: {
			noExternal: ['vue-calendar-3/style'],
		},
		plugins: vitePlugins,
		optimizeDeps: {
			exclude: ['fsevents'],
			include: ['vue', '@vueuse/core', 'v-calendar'],
		},
		define: {
			'import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		},
	},
});
