import { describe, expect, it } from 'vitest';
import { propertyLabel } from './reservations';

describe('propertyLabel', () => {
	it('returns correct label for valid property keys', () => {
		expect(propertyLabel('main_house')).toBe('Main House');
		expect(propertyLabel('workshop')).toBe('Workshop');
		expect(propertyLabel('both')).toBe('Both');
	});

	it('returns the fallback value for unknown property keys', () => {
		expect(propertyLabel('unknown')).toBe('unknown');
		expect(propertyLabel('')).toBe('');
		expect(propertyLabel('Main House')).toBe('Main House'); // testing exact label pass-through
	});
});
