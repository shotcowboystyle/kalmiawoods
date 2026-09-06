import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import { getBuildId } from './scripts/build-id.mjs';

const IS_PROD = process.env.NODE_ENV === 'production';

export default defineConfig({
	site: process.env.APP_SITE,
	trailingSlash: 'never',
	adapter: vercel(),
	image: {
		domains: [process.env.APP_HOST].filter(Boolean),
	},
	integrations: [
		mdx(),
		sitemap(),
		compress({
			CSS: false, // temporarily disabled due to lightningcss crash
			HTML: { removeAttributeQuotes: false },
			Image: false,
			JavaScript: true,
			SVG: true,
			Logger: 1,
		}),
	],
	vite: {
		// Same value the service worker is stamped with, so a page can tell the worker
		// which build the server is currently serving. See scripts/build-sw.mjs.
		define: {
			__BUILD_ID__: JSON.stringify(getBuildId()),
		},
		plugins: [
			tailwindcss(),
			IS_PROD && visualizer({ open: false, filename: 'stats.html', gzipSize: true }),
		].filter(Boolean),
		build: {
			sourcemap: IS_PROD,
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: (id) => {
						if (id.includes('leaflet')) return 'leaflet';
						if (id.includes('spotlight.js')) return 'spotlight';
					},
				},
			},
		},
		css: { devSourcemap: true },
		optimizeDeps: { exclude: ['fsevents'] },
	},
});
