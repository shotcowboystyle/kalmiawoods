export const PASSWORD_MIN_LENGTH = 12;

export type StrengthLabel = 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';

export type PasswordValidation = {
	valid: boolean;
	errors: string[];
	score: 0 | 1 | 2 | 3 | 4;
	label: StrengthLabel;
};

const COMMON_PASSWORDS = new Set([
	'password',
	'password1',
	'password123',
	'passw0rd',
	'p@ssword',
	'p@ssw0rd',
	'admin',
	'administrator',
	'letmein',
	'welcome',
	'welcome1',
	'qwerty',
	'qwerty123',
	'12345678',
	'123456789',
	'1234567890',
	'iloveyou',
	'monkey',
	'dragon',
	'kalmiawoods',
	'kalmia',
	'jocassee',
	'keowee',
]);

export const PASSWORD_RULES = [
	`At least ${PASSWORD_MIN_LENGTH} characters`,
	'An uppercase letter (A–Z)',
	'A lowercase letter (a–z)',
	'A digit (0–9)',
	'A symbol (e.g. ! @ # $ %)',
	'Not a commonly used password',
];

export function validatePassword(password: string, email?: string): PasswordValidation {
	const errors: string[] = [];

	if (password.length < PASSWORD_MIN_LENGTH) {
		errors.push(`Must be at least ${PASSWORD_MIN_LENGTH} characters.`);
	}

	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSymbol = /[^A-Za-z0-9]/.test(password);

	if (!hasLower) errors.push('Must include a lowercase letter.');
	if (!hasUpper) errors.push('Must include an uppercase letter.');
	if (!hasDigit) errors.push('Must include a digit.');
	if (!hasSymbol) errors.push('Must include a symbol.');

	const lowered = password.toLowerCase();
	if (COMMON_PASSWORDS.has(lowered)) {
		errors.push('This password is too common.');
	}

	if (email) {
		const local = email.split('@')[0]?.toLowerCase();
		if (local && local.length >= 3 && lowered.includes(local)) {
			errors.push('Password must not contain your email address.');
		}
	}

	if (/^(.)\1+$/.test(password)) {
		errors.push('Password cannot be a single repeated character.');
	}

	const score = scorePassword(password, hasLower, hasUpper, hasDigit, hasSymbol);
	const label = strengthLabel(score);

	return {
		valid: errors.length === 0,
		errors,
		score,
		label,
	};
}

function scorePassword(
	password: string,
	hasLower: boolean,
	hasUpper: boolean,
	hasDigit: boolean,
	hasSymbol: boolean,
): 0 | 1 | 2 | 3 | 4 {
	if (password.length === 0) return 0;

	let points = 0;
	const len = password.length;

	if (len >= 8) points += 1;
	if (len >= 12) points += 1;
	if (len >= 16) points += 1;
	if (len >= 20) points += 1;

	const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
	points += classes - 1;

	const uniqueChars = new Set(password).size;
	if (uniqueChars >= 8) points += 1;

	if (COMMON_PASSWORDS.has(password.toLowerCase())) points = 0;
	if (/^(.)\1+$/.test(password)) points = 0;

	if (points <= 1) return 0;
	if (points === 2 || points === 3) return 1;
	if (points === 4 || points === 5) return 2;
	if (points === 6 || points === 7) return 3;
	return 4;
}

function strengthLabel(score: 0 | 1 | 2 | 3 | 4): StrengthLabel {
	switch (score) {
		case 0:
			return 'Very Weak';
		case 1:
			return 'Weak';
		case 2:
			return 'Fair';
		case 3:
			return 'Good';
		case 4:
			return 'Strong';
	}
}
