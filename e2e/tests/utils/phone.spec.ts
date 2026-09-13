import { expect, test } from '@playwright/test';
import { phoneFormatUSA } from '../../../src/utils/phone';

test.describe('phoneFormatUSA', () => {
	test('returns null for empty input', () => {
		expect(phoneFormatUSA('')).toBeNull();
		// @ts-expect-error - testing runtime behavior with invalid inputs
		expect(phoneFormatUSA(null)).toBeNull();
		// @ts-expect-error - testing runtime behavior with invalid inputs
		expect(phoneFormatUSA(undefined)).toBeNull();
	});

	test('formats a valid 10-digit number', () => {
		expect(phoneFormatUSA('1234567890')).toBe('+1 123-456-7890');
		expect(phoneFormatUSA('9876543210')).toBe('+1 987-654-3210');
	});

	test('returns an error message when given fewer than 10 digits', () => {
		const expectedError = 'was not supplied enough numbers please pass a 10 digit number';
		expect(phoneFormatUSA('123456789')).toBe(expectedError);
		expect(phoneFormatUSA('1')).toBe(expectedError);
	});

	test('returns an error message when given more than 10 digits', () => {
		const expectedError = 'was supplied too many numbers please pass a 10 digit number';
		expect(phoneFormatUSA('12345678901')).toBe(expectedError);
		expect(phoneFormatUSA('123456789012345')).toBe(expectedError);
	});
});
