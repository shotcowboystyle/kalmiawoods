import type { SocialObjects } from '@/types';

export const APP_URL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}`;
export const API_URL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}api/`;

export const REMOTE_ASSETS_BASE_URL = `https://flowbite-admin-dashboard.vercel.app`;
// export const REMOTE_ASSETS_BASE_URL = `https://localhost:3000`;

export const SITE_TITLE = 'Kalmia Woods';

export const HOME = '/';

export const SOCIALS: SocialObjects = [
  {
    name: 'Facebook',
    href: '#',
    linkTitle: `${SITE_TITLE} on Facebook`,
    icon: 'brandico:facebook-rect',
  },
  {
    name: 'Instagram',
    href: '#',
    linkTitle: `${SITE_TITLE} on Instagram`,
    icon: 'brandico:instagram',
  },
  {
    name: 'LinkedIn',
    href: '#',
    linkTitle: `${SITE_TITLE} on LinkedIn`,
    icon: 'brandico:linkedin-rect',
  },
  {
    name: 'Mail',
    href: 'mailto:info@kalmiawoods.com',
    linkTitle: `Send an email to ${SITE_TITLE}`,
    icon: 'ri:mail-line',
  },
];

// NOTE: Unmapped
// export const SIDEBAR = [
// 	{
// 		title: 'Getting started',
// 		pages: [
// 			{ title: 'Introduction' },
// 			{ title: 'Quickstart' },
// 			{ title: 'Build tools' },
// 			{ title: 'License' },
// 			{ title: 'Changelog' },
// 		],
// 	},
// 	{
// 		title: 'Customize',
// 		pages: [
// 			{ title: 'Configuration' },
// 			{ title: 'Theming' },
// 			{ title: 'Color' },
// 			{ title: 'Icons' },
// 			{ title: 'Optimization' },
// 		],
// 	},
// 	{
// 		title: 'Components',
// 		pages: [
// 			{ title: 'Alerts' },
// 			{ title: 'Badge' },
// 			{ title: 'Breadcrumb' },
// 			{ title: 'Buttons' },
// 			{ title: 'Button group' },
// 			{ title: 'Card' },
// 			{ title: 'Dropdowns' },
// 			{ title: 'Forms' },
// 			{ title: 'Typography' },
// 			{ title: 'Modal' },
// 			{ title: 'Navbar' },
// 			{ title: 'Pagination' },
// 			{ title: 'Progress' },
// 			{ title: 'Tables' },
// 			{ title: 'Tooltips' },
// 		],
// 	},
// ];
