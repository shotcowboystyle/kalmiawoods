import { LOCAL_STORAGE_COLOR_SCHEME_KEY } from '@/app/constants';
import type { ColorScheme } from '@/types/ColorScheme';
import { persistentAtom } from '@nanostores/persistent';

export const applyColorScheme = (colorScheme: ColorScheme) => {
	const root = document.documentElement;

	if (colorScheme === 'dark') {
		root.setAttribute('data-theme', 'dark');
	} else {
		root.setAttribute('data-theme', 'light');
	}
};

export const getPreferredColorScheme = (): ColorScheme => {
	if (typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_COLOR_SCHEME_KEY)) {
		return localStorage.getItem(LOCAL_STORAGE_COLOR_SCHEME_KEY);
	}

	if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}

	return 'light';
};

const colorSchemeStore = persistentAtom<ColorScheme>(
	LOCAL_STORAGE_COLOR_SCHEME_KEY,
	getPreferredColorScheme(),
);
export const getColorScheme = (): ColorScheme => colorSchemeStore.get();
export const setColorScheme = (colorScheme: ColorScheme) => colorSchemeStore.set(colorScheme);

colorSchemeStore.subscribe((value: ColorScheme) => applyColorScheme(value));
