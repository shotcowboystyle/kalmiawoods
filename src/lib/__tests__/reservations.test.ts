import { describe, expect, it } from 'vitest';
import { isProperty, propertyLabel } from '../reservations';

describe('isProperty', () => {
	it('should return true for valid properties', () => {
		expect(isProperty('main_house')).toBe(true);
		expect(isProperty('workshop')).toBe(true);
		expect(isProperty('both')).toBe(true);
	});

	it('should return false for invalid properties', () => {
		expect(isProperty('garage')).toBe(false);
		expect(isProperty('mainhouse')).toBe(false);
		expect(isProperty('')).toBe(false);
		expect(isProperty('null')).toBe(false);
		expect(isProperty('undefined')).toBe(false);
	});
});

describe('propertyLabel', () => {
	it('should return the correct label for valid properties', () => {
		expect(propertyLabel('main_house')).toBe('Main House');
		expect(propertyLabel('workshop')).toBe('Workshop');
		expect(propertyLabel('both')).toBe('Both');
	});

	it('should return the fallback value for invalid properties', () => {
		expect(propertyLabel('garage')).toBe('garage');
		expect(propertyLabel('')).toBe('');
	});
});
