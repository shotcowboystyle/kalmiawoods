import type { ManifestOptions } from 'vite-plugin-pwa';
import type { GenerateSWOptions } from 'workbox-build';

const APP_NAME = 'Kalmia Woods';
const APP_DESCRIPTION =
	'A beautiful mountain vacation rental next to Lake Jocassee and Lake Keowee.';

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
	id: '/',
	name: 'Kalmia Woods',
	short_name: APP_NAME,
	description: APP_DESCRIPTION,
	lang: 'en',
	dir: 'ltr',
	theme_color: '#1eb854',
	background_color: '#1eb854',
	display_override: ['fullscreen', 'minimal-ui'],
	display: 'standalone',
	// orientation: 'landscape-primary',
	start_url: '/dashboard',
	// scope: '/',
	icons: [
		{
			src: 'favicons/android-chrome-192x192.png',
			sizes: '192x192',
			type: 'image/png',
			purpose: 'any',
		},
		{
			src: 'favicons/android-chrome-192x192.png',
			sizes: '192x192',
			type: 'image/png',
			purpose: 'maskable',
		},
		{
			src: 'favicons/android-chrome-512x512.png',
			sizes: '512x512',
			type: 'image/png',
			purpose: 'any',
		},
		{
			src: 'favicons/android-chrome-512x512.png',
			sizes: '512x512',
			type: 'image/png',
			purpose: 'maskable',
		},
	],
	categories: ['photo', 'productivity', 'utilities'],
	screenshots: [
		{
			src: 'favicons/screenshot1-0ff68546.png',
			type: 'image/png',
			sizes: '540x720',
			form_factor: 'narrow',
		},
		{
			src: 'favicons/screenshot2-1f78c4db.jpg',
			type: 'image/jpeg',
			sizes: '540x720',
			form_factor: 'narrow',
		},
		{
			src: 'favicons/screenshot3-c1e02216.jpg',
			type: 'image/jpeg',
			sizes: '540x720',
			form_factor: 'narrow',
		},
		{
			src: 'favicons/screenshot4-3a706c3c.png',
			type: 'image/png',
			sizes: '1024x593',
			form_factor: 'wide',
		},
		{
			src: 'favicons/screenshot5-ea50826f.jpg',
			type: 'image/jpeg',
			sizes: '1024x593',
			form_factor: 'wide',
		},
		{
			src: 'favicons/screenshot6-0168d284.jpg',
			type: 'image/jpeg',
			sizes: '1024x593',
			form_factor: 'wide',
		},
	],
	share_target: {
		action: '/?utm_medium=PWA&utm_source=share-target&share-target',
		method: 'POST',
		enctype: 'multipart/form-data',
		params: {
			files: [
				{
					name: 'file',
					accept: ['image/*'],
				},
			],
		},
	},
};

export const workbox: Partial<GenerateSWOptions> = {
	// Don't fallback on document based (e.g. `/some-page`) requests
	// This removes an errant console.log message from showing up.
	// navigateFallback: null,
	navigateFallback: '/404',
	globDirectory: 'dist',
	globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
	// globPatterns: ['**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,webmanifest,pdf,xml,json,txt,csv}'],
	globIgnores: ['**/node_modules/**', '**/dist/**'],
	runtimeCaching: [
		// {
		// 	// blog posts Network First (Network Falling Back to Cache). Cache is updated when user visits the page.
		// 	urlPattern: /^blog\/.*/i,
		// 	handler: 'NetworkFirst',
		// 	options: {
		// 		cacheName: 'blog-cache',
		// 		expiration: {
		// 			maxEntries: 1000,
		// 			maxAgeSeconds: 60 * 60 * 24, // <== 1 day
		// 		},
		// 		cacheableResponse: {
		// 			statuses: [0, 200],
		// 		},
		// 	},
		// },
		// pdf, xml, json, txt, csv, and webmanifest files Network First (Network Falling Back to Cache). Cache is updated when user visits the page.
		{
			urlPattern: /^.*\.(?:pdf|xml|json|txt|csv|webmanifest)$/i,
			handler: 'NetworkFirst',
			options: {
				cacheName: 'files-cache',
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
				},
			},
		},
		// cache favicons and images
		{
			urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|webp)$/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'images-cache',
				expiration: {
					maxEntries: 100,
					maxAgeSeconds: 60 * 60 * 24 * 3, // <== 3 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'google-fonts-cache',
				expiration: {
					maxEntries: 10,
					maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'gstatic-fonts-cache',
				expiration: {
					maxEntries: 10,
					maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			urlPattern: ({ url }) =>
				[/^https:\/\/raw\.githubusercontent\.com\/.*/i].some((regex) => regex.test(url.toString())),
			handler: 'CacheFirst',
			options: {
				cacheName: 'external-samples',
				expiration: {
					maxEntries: 5000,
					maxAgeSeconds: 60 * 60 * 24 * 30, // <== 14 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
	],
	skipWaiting: true,
	clientsClaim: true,
};
