export const SITE_TITLE = 'Kalmia Woods';

export const BASE_APP_URL = import.meta.env.SITE ?? '/';

export const CONTAINER_MAX_W = 'xl:max-w-6xl xl:mx-auto';

export const DARK_MODE_KEY = 'darkMode';
export const LOCAL_STORAGE_COLOR_SCHEME_KEY = 'color-scheme';
export const COLOR_SCHEME_OPTIONS = ['light', 'dark', 'system'];

export const SUMMARY_HIGHLIGHTS = [
	{
		title: 'Mountain Bike Trails',
		description: 'Explore the over 5 miles of private mountain biking trails.',
		icon: 'bike',
		containerClass: 'bg-info text-info-content',
	},
	{
		title: 'Game Room',
		description: 'A dedicated game room for kids and adults to go wild.',
		icon: 'gamepad',
		containerClass: 'mt-8 bg-success text-success-content',
	},
	{
		title: 'Barbecue',
		description: 'A covered outdoor kitchen for all your culinary needs.',
		icon: 'outdoor-grill',
		containerClass: 'bg-warning text-warning-content',
	},
	{
		title: 'Star Gazing',
		description: 'With little to no light pollution, watch the night sky light up.',
		icon: 'sparkles',
		containerClass: 'mt-8 bg-error text-error-content',
	},
];

export const SUMMARY_FEATURES = [
	{ text: 'Private Trails' },
	{ text: 'Camping' },
	{ text: 'Zip lines' },
	{ text: 'Gardens' },
	{ text: 'Canoeing' },
	{ text: 'Fire Pit' },
	{ text: 'Bird Watching' },
	{ text: 'Star Gazing' },
];

export const GUEST_ACCOMMODATIONS_DATA = [
	{ icon: 'users', text: '15 Guests' },
	{ icon: 'door-open', text: '6 Bedrooms' },
	{ icon: 'bed-double', text: '9 Beds' },
	{ icon: 'bath', text: '4 Bathrooms' },
];

export const HIGHLIGHTS_DATA = [
	{ icon: 'wifi', text: 'Wireless broadband internet' },
	{ icon: 'paw-print', text: 'Pets welcome' },
	{ icon: 'accessibility', text: 'Handicap accessible' },
];

export const SLEEPING_ARRANGEMENTS_DATA = [
	{ icons: ['bed'], title: 'Bedroom 1', text: '1 queen bed' },
	{
		icons: ['bed', 'bed-single', 'sofa'],
		title: 'Bedroom 2',
		text: '1 queen bed, 1 day bed, 1 futon',
	},
	{ icons: ['bed', 'bunk-bed'], title: 'Bedroom 3', text: '1 queen bed, 1 bunk bed' },
	{ icons: ['bed', 'bed-single'], title: 'Bedroom 4', text: '1 queen bed, 1 single bed' },
];

export const FOOTER_DATA = {
	secondaryLinks: [
		{ text: 'Terms', href: '/terms' },
		{ text: 'Privacy Policy', href: '/privacy' },
	],
	footNote: `Made by <a class="link link-info link-hover" href="https://shotcowboystyle.github.io">shotcowboystyle</a> · All rights reserved.`,
};

export const CONTACT_INFO = {
	address: {
		line1: '',
		line2: 'Salem, SC',
	},
	reservations: {
		email: 'reservations@kalmiawoods.com',
		phone: '843 761 1111',
	},
	wellness: {
		email: 'wellness@kalmiawoods.com',
		phone: '843 761 1111',
	},
	propertyManager: {
		email: 'property@kalmiawoods.com',
		phone: '843 761 1111',
	},
};
