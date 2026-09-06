import { expect, test } from '@playwright/test';
import { calculatePercent } from '../../../src/utils/math';

test.describe('calculatePercent', () => {
	test('should return 50 for 50 out of 100', () => {
		expect(calculatePercent(50, 100)).toBe(50);
	});

	test('should return 0 for 0 out of 100', () => {
		expect(calculatePercent(0, 100)).toBe(0);
	});

	test('should round properly for floating point results', () => {
		expect(calculatePercent(33.333, 100)).toBe(33);
		expect(calculatePercent(1, 3)).toBe(33);
		expect(calculatePercent(2, 3)).toBe(67);
	});

	test('should return 0 when total is 0 to avoid division by zero', () => {
		expect(calculatePercent(50, 0)).toBe(0);
		expect(calculatePercent(0, 0)).toBe(0);
	});

	test('should handle values larger than total', () => {
		expect(calculatePercent(150, 100)).toBe(150);
		expect(calculatePercent(200, 50)).toBe(400);
	});

	test('should handle negative numbers', () => {
		expect(calculatePercent(-50, 100)).toBe(-50);
		expect(calculatePercent(50, -100)).toBe(-50);
		expect(calculatePercent(-50, -100)).toBe(50);
	});
});
