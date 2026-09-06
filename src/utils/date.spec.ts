import { describe, expect, it } from 'vitest';
import { getLastDayOfMonth } from './date';

describe('date utils', () => {
	describe('getLastDayOfMonth', () => {
		it('should return the last day of a regular month', () => {
			const date = getLastDayOfMonth(2023, 0); // January
			expect(date.getFullYear()).toBe(2023);
			expect(date.getMonth()).toBe(0);
			expect(date.getDate()).toBe(31);
		});

		it('should return the last day of February in a non-leap year', () => {
			const date = getLastDayOfMonth(2023, 1); // February
			expect(date.getFullYear()).toBe(2023);
			expect(date.getMonth()).toBe(1);
			expect(date.getDate()).toBe(28);
		});

		it('should return the last day of February in a leap year', () => {
			const date = getLastDayOfMonth(2024, 1); // February
			expect(date.getFullYear()).toBe(2024);
			expect(date.getMonth()).toBe(1);
			expect(date.getDate()).toBe(29);
		});

		it('should return the last day of February in a century leap year', () => {
			const date = getLastDayOfMonth(2000, 1); // February
			expect(date.getFullYear()).toBe(2000);
			expect(date.getMonth()).toBe(1);
			expect(date.getDate()).toBe(29);
		});

		it('should return the last day of February in a century non-leap year', () => {
			const date = getLastDayOfMonth(1900, 1); // February
			expect(date.getFullYear()).toBe(1900);
			expect(date.getMonth()).toBe(1);
			expect(date.getDate()).toBe(28);
		});

		it('should handle December correctly', () => {
			const date = getLastDayOfMonth(2023, 11); // December
			expect(date.getFullYear()).toBe(2023);
			expect(date.getMonth()).toBe(11);
			expect(date.getDate()).toBe(31);
		});
	});
});
