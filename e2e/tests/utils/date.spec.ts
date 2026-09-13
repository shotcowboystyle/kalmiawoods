import { expect, test } from '@playwright/test';
import {
	formatQueryDateRange,
	getFirstDayOfMonth,
	getLastDayOfMonth,
} from '../../../src/utils/date';

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

test.describe('getLastDayOfMonth', () => {
	test('returns the last day of a 31-day month', () => {
		const date = getLastDayOfMonth(2023, 0); // January
		expect(date.getFullYear()).toBe(2023);
		expect(date.getMonth()).toBe(0);
		expect(date.getDate()).toBe(31);
	});

	test('returns 28 for February in a non-leap year', () => {
		const date = getLastDayOfMonth(2023, 1);
		expect(date.getMonth()).toBe(1);
		expect(date.getDate()).toBe(28);
	});

	test('returns 29 for February in a leap year', () => {
		const date = getLastDayOfMonth(2024, 1);
		expect(date.getMonth()).toBe(1);
		expect(date.getDate()).toBe(29);
	});

	test('returns 29 for February in a century leap year', () => {
		const date = getLastDayOfMonth(2000, 1);
		expect(date.getMonth()).toBe(1);
		expect(date.getDate()).toBe(29);
	});

	test('returns 28 for February in a century non-leap year', () => {
		const date = getLastDayOfMonth(1900, 1);
		expect(date.getMonth()).toBe(1);
		expect(date.getDate()).toBe(28);
	});

	test('handles December correctly', () => {
		const date = getLastDayOfMonth(2023, 11);
		expect(date.getFullYear()).toBe(2023);
		expect(date.getMonth()).toBe(11);
		expect(date.getDate()).toBe(31);
	});
});

test.describe('formatQueryDateRange', () => {
	test('formats a date as YYYY-MM-DD HH:mm:ss', () => {
		const date = new Date(2023, 0, 2, 13, 4, 5); // Month is 0-indexed (0 = Jan)
		expect(formatQueryDateRange(date)).toBe('2023-01-02 13:04:05');
	});

	test('pads single digits with zeros', () => {
		const date = new Date(2023, 8, 9, 8, 7, 6); // Sep 9, 08:07:06
		expect(formatQueryDateRange(date)).toBe('2023-09-09 08:07:06');
	});

	test('handles end of year dates', () => {
		const date = new Date(2023, 11, 31, 23, 59, 59);
		expect(formatQueryDateRange(date)).toBe('2023-12-31 23:59:59');
	});
});
