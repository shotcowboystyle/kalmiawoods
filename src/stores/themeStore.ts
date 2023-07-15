import { persistentAtom } from '@nanostores/persistent';

export const localeAtom = persistentAtom('locale', 'en');

export const darkModeAtom = persistentAtom<boolean>('darkMode', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

darkModeAtom.listen((darkMode) => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

if (typeof window !== 'undefined') {
  darkModeAtom.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
}
