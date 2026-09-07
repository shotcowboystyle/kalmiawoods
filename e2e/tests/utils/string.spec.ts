import { expect, test } from '@playwright/test';
import { capitalize } from '../../../src/utils/string';

test.describe('capitalize', () => {
	test('should capitalize the first letter and lowercase the rest', () => {
		expect(capitalize('hello')).toBe('Hello');
		expect(capitalize('WORLD')).toBe('World');
		expect(capitalize('wOrLd')).toBe('World');
		expect(capitalize('hElLo wOrLd')).toBe('Hello world');
	});

	test('should handle single characters', () => {
		expect(capitalize('a')).toBe('A');
		expect(capitalize('A')).toBe('A');
		expect(capitalize('1')).toBe('1');
	});

	test('should handle empty or whitespace strings', () => {
		expect(capitalize('')).toBe('');
		expect(capitalize(' ')).toBe(' ');
		expect(capitalize('  hello')).toBe('  hello');
	});

	test('should handle non-alphabetic starting characters', () => {
		expect(capitalize('!hello')).toBe('!hello');
		expect(capitalize('123test')).toBe('123test');
	});
});
