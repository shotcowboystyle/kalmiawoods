import { expect, test } from '@playwright/test';
import { getFirstDayOfMonth } from '../../../src/utils/date';

test.describe('getFirstDayOfMonth', () => {
	test('returns the first day of January 2023', () => {
		const date = getFirstDayOfMonth(2023, 0); // 0 is January
		expect(date.getFullYear()).toBe(2023);
		expect(date.getMonth()).toBe(0);
		expect(date.getDate()).toBe(1);
		expect(date.getHours()).toBe(0);
		expect(date.getMinutes()).toBe(0);
		expect(date.getSeconds()).toBe(0);
		expect(date.getMilliseconds()).toBe(0);
	});

	test('returns the first day of December 2024', () => {
		const date = getFirstDayOfMonth(2024, 11); // 11 is December
		expect(date.getFullYear()).toBe(2024);
		expect(date.getMonth()).toBe(11);
		expect(date.getDate()).toBe(1);
		expect(date.getHours()).toBe(0);
		expect(date.getMinutes()).toBe(0);
		expect(date.getSeconds()).toBe(0);
		expect(date.getMilliseconds()).toBe(0);
	});

	test('handles negative months (e.g. going back a year)', () => {
		const date = getFirstDayOfMonth(2023, -1); // December 2022
		expect(date.getFullYear()).toBe(2022);
		expect(date.getMonth()).toBe(11);
		expect(date.getDate()).toBe(1);
		expect(date.getHours()).toBe(0);
	});

	test('handles months greater than 11 (e.g. going forward a year)', () => {
		const date = getFirstDayOfMonth(2023, 12); // January 2024
		expect(date.getFullYear()).toBe(2024);
		expect(date.getMonth()).toBe(0);
		expect(date.getDate()).toBe(1);
		expect(date.getHours()).toBe(0);
	});

	test('handles leap year (February)', () => {
		const date = getFirstDayOfMonth(2024, 1); // 1 is February
		expect(date.getFullYear()).toBe(2024);
		expect(date.getMonth()).toBe(1);
		expect(date.getDate()).toBe(1);
		expect(date.getHours()).toBe(0);
	});
});
