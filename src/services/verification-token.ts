// import { emailVerificationToken } from './verification-token';

// import { auth } from '@/lib/lucia';
import { prismaClient } from '@/lib/db.js';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 12; // 12 hours

// export const emailVerificationToken = idToken(auth, 'email_verification', {
//   expiresIn: EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
// });

// export const passwordResetToken = idToken(auth, 'password_reset', {
//   expiresIn: EXPIRES_IN,
// });

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await prismaClient.emailVerificationToken.findMany({
		where: {
			user_id: userId,
		},
		// orderBy: {
		//   date_sent: 'desc',
		// },
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2);
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = generateRandomString(63);
	await prismaClient.emailVerificationToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
			user_id: userId,
		},
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await prismaClient.$transaction(async (trx) => {
		const storedToken = await trx.emailVerificationToken.findFirst({
			where: { id: token },
		});

		if (!storedToken) {
			throw new Error('Invalid token');
		}

		await trx.emailVerificationToken.delete({ where: { id: token } });

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await prismaClient.passwordResetToken.findMany({
		where: {
			user_id: userId,
		},
		// orderBy: {
		//   date_sent: 'desc',
		// },
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = generateRandomString(63);

	await prismaClient.passwordResetToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId,
		},
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	const storedToken = await prismaClient.$transaction(async (trx) => {
		const storedToken = await trx.passwordResetToken.findFirst({
			where: {
				id: token,
			},
		});

		if (!storedToken) {
			throw new Error('Invalid token');
		}

		await trx.passwordResetToken.delete({ where: { id: token } });

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.user_id;
};

export const isValidPasswordResetToken = async (token: string) => {
	const storedToken = await prismaClient.passwordResetToken.findFirst({
		where: {
			id: token,
		},
		// orderBy: {
		//   date_sent: 'desc',
		// },
	});

	if (!storedToken) {
		return false;
	}

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion

	if (!isWithinExpiration(tokenExpires)) {
		return false;
	}

	return true;
};
