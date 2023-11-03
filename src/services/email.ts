import { route } from '@/config';
import { prismaClient } from '@/lib/db.js';
import type { Email } from '@prisma/client';

const sendEmail = async (emailAddress: string, subject: string, content: string) => {
	await prismaClient.email.create({
		data: {
			subject,
			email_address: emailAddress,
			content,
			date_sent: new Date(),
		},
	});
};

export const sendEmailVerificationEmail = async (
	emailAddress: string,
	verificationToken: string,
) => {
	const resetLink = route(`/auth/email-verification/${verificationToken}`);
	const emailContent = `Please complete your registration for Kalmia Woods via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
	await sendEmail(emailAddress, 'Complete registration for Kalmia Woods', emailContent);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
	const resetLink = route(`/auth/password-reset/${resetToken}`);
	const emailContent = `Please reset your password via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
	await sendEmail(emailAddress, 'Password reset', emailContent);
};

const transformDatabaseEmail = (databaseEmail: Email) => ({
	emailId: databaseEmail.id,
	toAddress: databaseEmail.email_address,
	dateSent: databaseEmail.date_sent,
	subject: databaseEmail.subject,
	content: databaseEmail.content,
});

export const getEmails = async (emailAddressQuery?: string) => {
	const databaseEmails = await prismaClient.email.findMany({
		where: {
			email_address: {
				contains: emailAddressQuery ?? '',
			},
		},
		orderBy: {
			date_sent: 'desc',
		},
	});

	return databaseEmails.map((databaseEmail: Email) => transformDatabaseEmail(databaseEmail));
};

export const getEmail = async (emailId: string) => {
	const databaseEmail = await prismaClient.email.findFirst({
		where: {
			id: emailId,
		},
	});

	if (!databaseEmail) {
		return null;
	}

	return transformDatabaseEmail(databaseEmail);
};
