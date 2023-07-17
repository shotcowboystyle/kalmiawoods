export const BASE_APP_URL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}`;
export const BASE_API_URL = `${import.meta.env.SITE}${import.meta.env.BASE_URL}api`;

export const REMOTE_ASSETS_BASE_URL = `https://flowbite-admin-dashboard.vercel.app`;
// export const REMOTE_ASSETS_BASE_URL = `https://localhost:3000`;

export const SITE_TITLE = 'Kalmia Woods';

export const HOME = '/';

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
