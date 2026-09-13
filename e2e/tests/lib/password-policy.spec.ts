import { expect, test } from '@playwright/test';
import { validatePassword } from '../../../src/lib/password-policy';

test.describe('validatePassword - accepted passwords', () => {
	test('accepts a 15-char password with all four classes (Good)', () => {
		const result = validatePassword('Valid1!Password');
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.score).toBe(3);
		expect(result.label).toBe('Good');
	});

	test('accepts a long password with all four classes (Strong)', () => {
		const result = validatePassword('Valid1!Password2023IsVeryLong');
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.score).toBe(4);
		expect(result.label).toBe('Strong');
	});
});

test.describe('validatePassword - rule violations', () => {
	test('rejects a password under the minimum length', () => {
		const result = validatePassword('Short1!');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must be at least 12 characters.');
	});

	test('rejects a password missing a lowercase letter', () => {
		const result = validatePassword('NOLOWERCASE1!');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must include a lowercase letter.');
	});

	test('rejects a password missing an uppercase letter', () => {
		const result = validatePassword('nouppercase1!');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must include an uppercase letter.');
	});

	test('rejects a password missing a digit', () => {
		const result = validatePassword('NoDigitHere!');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must include a digit.');
	});

	test('rejects a password missing a symbol', () => {
		const result = validatePassword('NoSymbolHere1');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must include a symbol.');
	});

	test('reports every broken rule at once', () => {
		const result = validatePassword('short');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Must be at least 12 characters.');
		expect(result.errors).toContain('Must include an uppercase letter.');
		expect(result.errors).toContain('Must include a digit.');
		expect(result.errors).toContain('Must include a symbol.');
	});
});

test.describe('validatePassword - denylist and email', () => {
	test('rejects a password on the common-password denylist', () => {
		const result = validatePassword('password123');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('This password is too common.');
		expect(result.score).toBe(0);
		expect(result.label).toBe('Very Weak');
	});

	test('matches the denylist case-insensitively', () => {
		const result = validatePassword('Password123');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('This password is too common.');
		expect(result.score).toBe(0);
	});

	test('rejects a password containing the email local-part', () => {
		const result = validatePassword('myPrefix123!AndMore', 'prefix@example.com');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Password must not contain your email address.');
	});

	test('ignores an email local-part shorter than 3 characters', () => {
		const result = validatePassword('ab123!AndMoreLetters', 'ab@example.com');
		expect(result.valid).toBe(true);
		expect(result.errors).not.toContain('Password must not contain your email address.');
	});

	test('rejects a single repeated character', () => {
		const result = validatePassword('aaaaaaaaaaaa');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Password cannot be a single repeated character.');
		expect(result.score).toBe(0);
	});

	test('rejects a single repeated symbol', () => {
		const result = validatePassword('!!!!!!!!!!!!');
		expect(result.valid).toBe(false);
		expect(result.errors).toContain('Password cannot be a single repeated character.');
		expect(result.score).toBe(0);
	});
});

test.describe('validatePassword - scoring', () => {
	test('scores an empty password as Very Weak', () => {
		const result = validatePassword('');
		expect(result.score).toBe(0);
		expect(result.label).toBe('Very Weak');
	});

	test('scores a tiny single-class password as Very Weak', () => {
		const result = validatePassword('abc');
		expect(result.score).toBe(0);
		expect(result.label).toBe('Very Weak');
	});

	test('scores an 8-char two-class password as Weak', () => {
		// 8 chars (+1), 2 classes (+1), 8 unique (+1) = 3 points
		const result = validatePassword('abcDEFgh');
		expect(result.score).toBe(1);
		expect(result.label).toBe('Weak');
	});

	test('scores a 10-char four-class password as Fair', () => {
		// 10 chars (+1), 4 classes (+3), 10 unique (+1) = 5 points
		const result = validatePassword('abcDEF12!@');
		expect(result.score).toBe(2);
		expect(result.label).toBe('Fair');
	});
});
