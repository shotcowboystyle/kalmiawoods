import { expect, test } from '@playwright/test';
import { formatQueryDateRange } from '../../../src/utils/date';

test.describe('formatQueryDateRange', () => {
	test('formats a date to YYYY-MM-DD HH:mm:ss format', () => {
		const date = new Date(2023, 0, 2, 13, 4, 5); // Month is 0-indexed (0 = Jan)
		expect(formatQueryDateRange(date)).toBe('2023-01-02 13:04:05');
	});

	test('pads single digits with zeros', () => {
		const date = new Date(2023, 8, 9, 8, 7, 6); // Sep 9, 08:07:06
		expect(formatQueryDateRange(date)).toBe('2023-09-09 08:07:06');
	});

	test('handles end of year dates properly', () => {
		const date = new Date(2023, 11, 31, 23, 59, 59); // Dec 31, 23:59:59
		expect(formatQueryDateRange(date)).toBe('2023-12-31 23:59:59');
	});
});
