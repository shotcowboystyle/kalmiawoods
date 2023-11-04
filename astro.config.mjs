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
import { loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './src/seo';

const IS_PROD = process.env.NODE_ENV === 'production';

const { APP_SITE, APP_BASE } = loadEnv(process.env.MODE, process.cwd(), '');
const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}`;

const vitePlugins = [
	VitePWA({
		registerType: 'autoUpdate',
		manifest,
		workbox: {
			globDirectory: 'dist',
			globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
			// Don't fallback on document based (e.g. `/some-page`) requests
			// This removes an errant console.log message from showing up.
			navigateFallback: null,
		},
	}),
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
			minimumCacheTTL: 60,
			formats: ['image/avif', 'image/webp'],
		},
		imageService: true,
		devImageService: 'sharp',
		edgeMiddleware: false,
	}),
	integrations: [
		svgSprite({
			mode: 'verbose',
		}),
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
		prefetch(),
		// critters({ Logger: 2 }),
		// purgecss({
		// 	safelist: [/^dot\d/, /^four-/, /^glow-/, /^crater-/, 'github', 'linkedin', 'twitter'],
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
					},
				},
			},
		},
		css: {
			devSourcemap: true,
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
