import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/astro';
import Components from 'unplugin-vue-components/vite';

const IS_PROD = process.env.NODE_ENV === 'production';

export default defineConfig({
	site: process.env.APP_SITE,
	trailingSlash: 'never',
	output: 'static',
	image: {
		domains: [process.env.APP_HOST].filter(Boolean),
	},
	integrations: [
		mdx(),
		sitemap(),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: tag => tag.startsWith('kw-'),
				},
			},
		}),
		AutoImport({
			imports: ['vue', { '@vueuse/core': ['useScroll'] }],
			dts: 'src/auto-imports.d.ts',
			dirs: ['src/composables'],
			vueTemplate: true,
		}),
		compress({
			CSS: true,
			HTML: { removeAttributeQuotes: false },
			Image: false,
			JavaScript: true,
			SVG: true,
			Logger: 1,
		}),
	],
	vite: {
		plugins: [
			tailwindcss(),
			Components({ dts: 'src/components.d.ts', directoryAsNamespace: true }),
			IS_PROD && visualizer({ open: false, filename: 'stats.html', gzipSize: true }),
		].filter(Boolean),
		build: {
			sourcemap: IS_PROD,
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: id => {
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
