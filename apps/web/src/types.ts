export type SocialMedia =
  | 'Github'
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn'
  | 'Mail'
  | 'Twitter'
  | 'Twitch'
  | 'YouTube'
  | 'WhatsApp'
  | 'Snapchat'
  | 'Pinterest'
  | 'TikTok'
  | 'CodePen'
  | 'Discord'
  | 'GitLab'
  | 'Reddit'
  | 'Skype'
  | 'Steam'
  | 'Telegram'
  | 'Mastodon';

export type SocialObjects = {
  name: SocialMedia;
  href: string;
  linkTitle: string;
  icon: string;
}[];
