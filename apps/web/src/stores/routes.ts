import { action, atom } from 'nanostores';

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const baseAPIPath = `${basePath}/api`;

export const route = (pathName?: string) => `${basePath}/${pathName ?? ''}`;
export const apiRoute = (pathName?: string) => `${baseAPIPath}/${pathName ?? ''}`.replace(/\/$/, '');

enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface Page {
  name: string;
  description: string;
  label: string;
  to: string;
  visible?: boolean;
  auth?: boolean;
  role?: RoleEnum;
  parent?: string;
}
export const pages = atom<Page[]>([
  {
    name: 'index',
    description: 'Kalmia Woods - Your home away from home.',
    label: 'Home',
    to: route(),
  },
  {
    name: 'users',
    description: 'List of all users',
    label: 'Users',
    to: route('users'),
    auth: true,
    // role: RoleEnum.ADMIN,
  },
  {
    name: 'new_user',
    description: 'Create New User',
    label: 'Users',
    to: route('users/create'),
    parent: 'users',
    auth: true,
    role: RoleEnum.ADMIN,
    visible: false,
  },
  { name: 'reservations', description: 'View current reservations', label: 'Reservations', to: route('reservations') },
  {
    name: 'new_reservation',
    description: 'Create New Reservation',
    label: 'Reservations',
    to: route('reservations/create'),
    parent: 'reservations',
    auth: true,
    visible: false,
  },
  // {
  //   name: 'ewb_quicklook',
  //   description: 'EWB Quicklook',
  //   label: 'EWB',
  //   to: route('ewb-quicklook'),
  //   visible: false,
  // },
  // {
  //   name: 'validation',
  //   description: 'Validation',
  //   label: 'Validation',
  //   to: route('validation'),
  //   visible: false,
  // },
  // { name: 'faq', description: 'Frequently Asked Questions', label: 'FAQ', to: `route('faq') },
  { name: 'login', description: 'Login Page', label: 'Login', to: route('login'), visible: false },
]);

export const activePage = atom({} as Page);
export const activePageURL = atom({} as URL);

const setActivePageURL = action(activePageURL, 'setActivePageURL', (p, payload: URL) => p.set(payload));

export const setActivePage = action(activePage, 'setActivePage', (p, payload: string) => {
  const nPageUrl = new URL(payload);
  const nPagePath = nPageUrl.pathname;

  const defaultPage = pages.get().find(({ name }) => name === 'index');
  const newPage =
    nPagePath === route()
      ? defaultPage
      : pages
          .get()
          .filter(({ name }) => name !== 'index')
          .find(({ to }) => nPagePath === to) ?? { ...defaultPage, to: nPageUrl.pathname };

  setActivePageURL(nPageUrl);

  p.set(newPage);
});
