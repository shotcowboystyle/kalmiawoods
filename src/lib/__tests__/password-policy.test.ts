import { describe, expect, it } from 'vitest';
import { validatePassword } from '../password-policy';

describe('validatePassword', () => {
	describe('happy paths', () => {
		it('should validate a good password (score 3)', () => {
			// 15 chars: +1 for 8, +1 for 12
			// classes 4 => +3
			// unique 12 >= 8 => 1 => 6 => score 3
			const result = validatePassword('Valid1!Password');
			expect(result.valid).toBe(true);
			expect(result.errors.length).toBe(0);
			expect(result.score).toBe(3);
			expect(result.label).toBe('Good');
		});

		it('should validate a strong password (score 4)', () => {
			// length 29 >= 20 => +4
			// classes 4 => +3
			// unique > 8 => +1
			// total = 8 => score 4 (Strong)
			const result = validatePassword('Valid1!Password2023IsVeryLong');
			expect(result.valid).toBe(true);
			expect(result.errors.length).toBe(0);
			expect(result.score).toBe(4);
			expect(result.label).toBe('Strong');
		});
	});

	describe('error cases', () => {
		it('should fail if password is too short', () => {
			const result = validatePassword('Short1!');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must be at least 12 characters.');
		});

		it('should fail if missing lowercase letter', () => {
			const result = validatePassword('NOLOWERCASE1!');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must include a lowercase letter.');
		});

		it('should fail if missing uppercase letter', () => {
			const result = validatePassword('nouppercase1!');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must include an uppercase letter.');
		});

		it('should fail if missing digit', () => {
			const result = validatePassword('NoDigitHere!');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must include a digit.');
		});

		it('should fail if missing symbol', () => {
			const result = validatePassword('NoSymbolHere1');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must include a symbol.');
		});

		it('should fail if multiple rules are broken', () => {
			const result = validatePassword('short');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Must be at least 12 characters.');
			expect(result.errors).toContain('Must include an uppercase letter.');
			expect(result.errors).toContain('Must include a digit.');
			expect(result.errors).toContain('Must include a symbol.');
		});
	});

	describe('edge cases', () => {
		it('should fail if password is a common password', () => {
			const result = validatePassword('password123');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('This password is too common.');
			expect(result.score).toBe(0);
			expect(result.label).toBe('Very Weak');
		});

		it('should ignore case when checking common passwords', () => {
			const result = validatePassword('Password123');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('This password is too common.');
			expect(result.score).toBe(0);
			expect(result.label).toBe('Very Weak');
		});

		it('should fail if password contains user email prefix', () => {
			const result = validatePassword('myPrefix123!AndMore', 'prefix@example.com');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Password must not contain your email address.');
		});

		it('should ignore email prefix if it is less than 3 characters', () => {
			const result = validatePassword('ab123!AndMoreLetters', 'ab@example.com');
			expect(result.valid).toBe(true);
			expect(result.errors).not.toContain('Password must not contain your email address.');
		});

		it('should fail if password is a single repeated character', () => {
			const result = validatePassword('aaaaaaaaaaaa');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Password cannot be a single repeated character.');
			expect(result.score).toBe(0);
		});

		it('should fail single repeated character even with mixed cases or valid chars if same', () => {
			const result = validatePassword('!!!!!!!!!!!!');
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Password cannot be a single repeated character.');
			expect(result.score).toBe(0);
		});
	});

	describe('score and label combinations', () => {
		it('should evaluate empty password as Very Weak (score 0)', () => {
			const result = validatePassword('');
			expect(result.score).toBe(0);
			expect(result.label).toBe('Very Weak');
		});

		it('should evaluate a very simple short password as Very Weak (score 0)', () => {
			const result = validatePassword('abc');
			expect(result.score).toBe(0);
			expect(result.label).toBe('Very Weak');
		});

		it('should evaluate a slightly better short password as Weak (score 1)', () => {
			// let's aim for exactly 2 points
			// classes 2 => +1
			// length 7 => 0
			// unique < 8 => 0
			// total = 1 -> score 0?
			// Wait:
			// points <= 1 returns 0
			// points === 2 || points === 3 returns 1
			// let's get exactly 2 points: length 8 (+1), classes 2 (+1) = 2 points
			// abcDEFgh: length 8 (+1), classes 2 (+1) = 2 points => returns 1
			const result = validatePassword('abcDEFgh');
			expect(result.score).toBe(1);
			expect(result.label).toBe('Weak');
		});

		it('should evaluate a fair password as Fair (score 2)', () => {
			// 10 chars (+1), 4 classes (+3), unique > 8 (+1) => 5 points => returns 2
			const result = validatePassword('abcDEF12!@');
			expect(result.score).toBe(2);
			expect(result.label).toBe('Fair');
		});
	});
});
