export const BASE_APP_URL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}`;

export const REMOTE_ASSETS_BASE_URL = `https://flowbite-admin-dashboard.vercel.app`;
// export const REMOTE_ASSETS_BASE_URL = `https://localhost:3000`;

export const SITE_TITLE = 'Kalmia Woods';

export const HOME = '/dashboard';

export const publicRoutes = ['/auth', '/signup', '/maintenance', '/403', '/404', '/500', '/email'];
export const passthroughRoutes = [`/_image`, `/api`];

export const pages = [
	{
		name: 'index',
		description: 'Kalmia Woods - Your home away from home.',
		label: 'Home',
		to: '',
		auth: true,
	},
	{
		name: 'users',
		description: 'List of all users',
		label: 'Users',
		to: 'admin/users',
		auth: true,
		role: 'ADMIN',
	},
	{
		name: 'new_user',
		description: 'Create New User',
		label: 'Users',
		to: 'admin/users/create',
		parent: 'users',
		auth: true,
		role: 'ADMIN',
		visible: false,
	},
	{
		name: 'reservations',
		description: 'View current reservations',
		label: 'Reservations',
		to: 'reservations',
		auth: true,
	},
	{
		name: 'new_reservation',
		description: 'Create New Reservation',
		label: 'Reservations',
		to: 'reservations/create',
		parent: 'reservations',
		auth: true,
	},
	{
		name: 'profile',
		description: 'Profile Page',
		label: 'Profile',
		to: 'auth/profile',
		auth: true,
	},
	{
		name: 'login',
		description: 'Login Page',
		label: 'Login',
		to: 'auth/login',
		visible: false,
	},
	{
		name: 'resend_complete_registration',
		description: 'Resend complete registration email',
		label: 'Send complete registration email',
		to: 'auth/email-verification',
		visible: false,
	},
	{
		name: 'complete_registration',
		description: 'Complete registration',
		label: 'Complete Registration',
		to: 'auth/email-verification/[token]',
		visible: false,
	},
	{
		name: 'password_recovery',
		description: 'Request password reset',
		label: 'Reset password',
		to: 'auth/password-reset',
		visible: false,
	},
	{
		name: 'password_reset',
		description: 'Reset your password',
		label: 'Password Reset',
		to: 'auth/password-reset/[token]',
		visible: false,
	},
];

export const UNEXPECTED_SERVER_ERROR_MESSAGE =
	'There was an unexpected server when completing this request. Please try again later.';

export const CONTAINER_MAX_W = 'xl:max-w-6xl xl:mx-auto';

export const DARK_MODE_KEY = 'darkMode';
export const LOCAL_STORAGE_COLOR_SCHEME_KEY = 'color-scheme';
export const COLOR_SCHEME_OPTIONS = ['light', 'dark', 'system'];

export const SUMMARY_HIGHLIGHTS = [
	{
		title: 'Mountain Bike Trails',
		description: 'Explore the over 5 miles of private mountain biking trails.',
		icon: 'bike-icon',
		containerClass: 'bg-info text-info-content',
	},
	{
		title: 'Game Room',
		description: 'A dedicated game room for kids and adults to go wild.',
		icon: 'gamepad-2-icon',
		containerClass: 'mt-8 bg-success text-success-content',
	},
	{
		title: 'Barbecue',
		description: 'A covered outdoor kitchen for all your culinary needs.',
		icon: 'outdoor-grill-icon',
		containerClass: 'bg-warning text-warning-content',
	},
	{
		title: 'Star Gazing',
		description: 'With little to no light pollution, watch the night sky light up.',
		icon: 'sparkles-icon',
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

export const AMENITIES_DATA = [
	{
		icon: 'utensils-icon',
		title: 'Cooking',
		description: 'Oven, microwave, dishwasher and all the other common appliances',
	},
	{
		icon: 'tv-icon',
		title: 'Entertainment',
		description: 'TV, DVD player, projector with portable screen',
	},
	{
		icon: 'dices-icon',
		title: 'Game Room',
		description: 'Game room with video/board/card games, air hockey, etc.',
	},
	{
		icon: 'library-icon',
		title: 'Library',
		description: 'Library with large collection of books.',
	},
	{
		icon: 'air-vent-icon',
		title: 'Heating/Cooling',
		description: 'Fireplace and central heating/air',
	},
	{
		icon: 'chef-hat-icon',
		title: 'Outdoor Kitchen',
		description: 'Gas and charcoal grills',
	},
	{ icon: 'flower-2-icon', title: 'Gardens', description: 'Bonsai garden, herb garden, terrace' },
	{
		icon: 'flame-kindling-icon',
		title: 'Outside',
		description: 'Outdoor fire pit with plenty of firewood',
	},
	{
		icon: 'parking-square-icon',
		title: 'Parking',
		description: 'Plenty parking and utility vehicle storage',
	},
];

export const GUEST_ACCOMMODATIONS_DATA = [
	{ icon: 'users-2-icon', text: '15 Guests' },
	{ icon: 'door-open-icon', text: '6 Bedrooms' },
	{ icon: 'bed-double-icon', text: '9 Beds' },
	{ icon: 'bath-icon', text: '4 Bathrooms' },
];

export const HIGHLIGHTS_DATA = [
	{ icon: 'paw-print-icon', text: 'Pets welcome' },
	{ icon: 'accessibility-icon', text: 'Handicap accessible' },
	// { icon: 'wifi-icon', text: 'Wireless broadband internet' },
];

export const SLEEPING_ARRANGEMENTS_DATA = [
	{ icon: 'bed-double-icon', text: '4 queen beds' },
	{ icon: 'bed-single-icon', text: '4 single beds' },
	{ icon: 'sofa-icon', text: '2 couches' },
	{ icon: 'bed-icon', text: '5 air mattresses' },
];

export const FOOTER_DATA = {
	secondaryLinks: [
		{ text: 'Terms', href: '/terms' },
		{ text: 'Privacy Policy', href: '/privacy' },
	],
	footNote: `Made by <a class="link link-info link-hover" href="https://shotcowboystyle.github.io">shotcowboystyle</a> · All rights reserved.`,
};
