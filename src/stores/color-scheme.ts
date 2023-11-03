import { LOCAL_STORAGE_COLOR_SCHEME_KEY } from '@/app/constants';
import type { ColorScheme } from '@/types/ColorScheme';
import type { BooleanAsString } from '@/types/common';
import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/vue';

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
export const $colorScheme = useStore(colorSchemeStore);
export const getColorScheme = (): ColorScheme => colorSchemeStore.get();
export const setColorScheme = (colorScheme: ColorScheme) => colorSchemeStore.set(colorScheme);

colorSchemeStore.subscribe((value: ColorScheme) => applyColorScheme(value));

function getPrefersReducedMotion(): BooleanAsString {
	if (window?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return 'true';
	}

	return 'false';
}

const prefersReducedMotionStore = persistentAtom<BooleanAsString>(
	'reducedMotion',
	getPrefersReducedMotion(),
);
export const $prefersReducedMotion = useStore(prefersReducedMotionStore);
