import { expect, test } from '@playwright/test';
import { isValidEmail } from '../../../src/utils/email';

test.describe('isValidEmail', () => {
	test('returns true for valid email addresses', () => {
		expect(isValidEmail('test@example.com')).toBe(true);
		expect(isValidEmail('user.name@domain.co')).toBe(true);
		expect(isValidEmail('plus+trick@email.org')).toBe(true);
		expect(isValidEmail('a@b.c')).toBe(true);
	});

	test('returns false for invalid email strings', () => {
		expect(isValidEmail('not-an-email')).toBe(false);
		expect(isValidEmail('test@')).toBe(false);
		expect(isValidEmail('@example.com')).toBe(false);
		expect(isValidEmail('')).toBe(false);
		expect(isValidEmail(' ')).toBe(false);
	});

	test('returns false for non-string inputs', () => {
		expect(isValidEmail(null)).toBe(false);
		expect(isValidEmail(undefined)).toBe(false);
		expect(isValidEmail(123)).toBe(false);
		expect(isValidEmail({})).toBe(false);
		expect(isValidEmail([])).toBe(false);
		expect(isValidEmail(() => {})).toBe(false);
	});
});
