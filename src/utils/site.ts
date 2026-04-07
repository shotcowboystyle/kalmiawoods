export function url(path = '') {
	return `${import.meta.env.SITE ?? ''}${path}`;
}

export function asset(path: string) {
	return `/${path}`;
}
