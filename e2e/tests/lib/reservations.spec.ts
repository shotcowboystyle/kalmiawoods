import { expect, test } from '@playwright/test';
import { isProperty, propertyLabel } from '../../../src/lib/reservations';

test.describe('isProperty', () => {
	test('returns true for the three known properties', () => {
		expect(isProperty('main_house')).toBe(true);
		expect(isProperty('workshop')).toBe(true);
		expect(isProperty('both')).toBe(true);
	});

	test('returns false for anything else', () => {
		expect(isProperty('garage')).toBe(false);
		expect(isProperty('mainhouse')).toBe(false);
		expect(isProperty('')).toBe(false);
		expect(isProperty('null')).toBe(false);
		expect(isProperty('undefined')).toBe(false);
	});
});

test.describe('propertyLabel', () => {
	test('returns the display label for known properties', () => {
		expect(propertyLabel('main_house')).toBe('Main House');
		expect(propertyLabel('workshop')).toBe('Workshop');
		expect(propertyLabel('both')).toBe('Both');
	});

	test('falls back to the raw value for unknown properties', () => {
		expect(propertyLabel('garage')).toBe('garage');
		expect(propertyLabel('')).toBe('');
	});
});
