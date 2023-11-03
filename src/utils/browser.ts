/**
 *
 * @returns true if the browser is iOS
 * @see https://stackoverflow.com/a/9039885/104380
 */
export function isIOS() {
	if (navigator) {
		return (
			// if it is legacy browser
			['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
				navigator?.platform ?? '',
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	}
}
