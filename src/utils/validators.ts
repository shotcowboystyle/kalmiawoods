import { validatePhoneUSA } from '@/utils/phone';

export default {
	email: (value: string | boolean) => {
		return {
			isValid:
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					`${value}`,
				),
			errorMessage: 'Enter a valid email.',
		};
	},
	phone: (value: string) => {
		return {
			isValid: validatePhoneUSA(value),
			errorMessage: 'Enter a valid 10 digit US phone number.',
		};
	},
	isUnique: (
		value: string,
		{
			matchers = [],
			errorMessagePrefix = 'Value',
		}: { matchers: string[]; errorMessagePrefix: string },
	) => {
		return {
			isValid: !matchers?.includes(value),
			errorMessage: `${errorMessagePrefix} must be unique and this value has already been used.`,
		};
	},
	password: (value: string | boolean) => {
		return {
			isValid: /^(?=.*[0-9])(?=.*[!@#$%^&*_+=]).{8,42}$/.test(`${value}`),
			errorMessage:
				'Your password must be at least 8 characters long, include 1 special character (!@#$%^&*_+=), 1 uppercase letter, 1 lowercase letter and 1 number.',
		};
	},
	isMatch: (
		value: string,
		{ match, errorMessagePrefix = 'Value' }: { match: string; errorMessagePrefix: string },
	) => {
		return {
			isValid: value === match,
			errorMessage: `${errorMessagePrefix} don't match.`,
		};
	},
	required: (value: string[] | string | boolean) => {
		return {
			isValid:
				(Array.isArray(value) && value.length > 0) ||
				(value && String(value).length > 0) ||
				value === true,
			errorMessage: 'This field is required.',
		};
	},
} as Record<
	'email' | 'password' | 'required' | 'phone' | 'isMatch' | 'isUnique',
	(
		value: string[] | string | boolean,
		extraArgs?: { matchers?: string[]; match?: string; errorMessagePrefix?: string },
	) => { isValid: boolean; errorMessage: string }
>;
