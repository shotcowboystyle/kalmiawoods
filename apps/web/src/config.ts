import type { SocialObjects } from './types';

export const SITE = {
  website: 'https://www.kalmiawoods.com',
  author: 'Curtis Blanton',
  desc: 'A beautiful mountain vacation rental next to Lake Jocassee and Lake Keowee.',
  title: 'Kalmia Woods',
  ogImage: 'astropaper-og.jpg',
  lightAndDarkMode: true,
};

export const SOCIALS: SocialObjects = [
  {
    name: 'Facebook',
    href: '#',
    linkTitle: `${SITE.title} on Facebook`,
    icon: 'brandico:facebook-rect',
  },
  {
    name: 'Instagram',
    href: '#',
    linkTitle: `${SITE.title} on Instagram`,
    icon: 'brandico:instagram',
  },
  {
    name: 'LinkedIn',
    href: '#',
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: 'brandico:linkedin-rect',
  },
  {
    name: 'Mail',
    href: 'mailto:info@kalmiawoods.com',
    linkTitle: `Send an email to ${SITE.title}`,
    icon: 'ri:mail-line',
  },
];
