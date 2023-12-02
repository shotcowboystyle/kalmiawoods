// https://easings.net/

const PI = Math.PI;

export function easeOutSine(x: number) {
	return Math.sin((x * Math.PI) / 2);
}

export function easeInOutSine(x: number) {
	return -(Math.cos(PI * x) - 1) / 2;
}

export function easeOutExpo(x: number) {
	return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutExpo(x: number) {
	if (x === 0) {
		return 0;
	}

	if (x === 1) {
		return 1;
	}

	if (x < 0.5) {
		return Math.pow(2, 20 * x - 10) / 2;
	}

	return (2 - Math.pow(2, -20 * x + 10)) / 2;
}

export function easeOutBack(x: number) {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
