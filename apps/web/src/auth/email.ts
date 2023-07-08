// import { Email } from '@kalmiawoods/database';

import { APP_URL } from '@/constants';
import { prismaClient } from '@/db.js';
import { generateId } from '@/utils/generate-id';

const sendEmail = async (emailAddress: string, subject: string, content: string) => {
  await prismaClient.email.create({
    data: {
      id: generateId(8),
      subject,
      email_address: emailAddress,
      content,
      date_sent: new Date(),
    },
  });
};

export const sendCompleteRegistrationEmail = async (emailAddress: string, registrationToken: string) => {
  const resetLink = `${APP_URL}/auth/complete-registration/${registrationToken}`;
  const emailContent = `Please complete your registration for Kalmia Woods via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
  await sendEmail(emailAddress, 'Complete registration for Kalmia Woods', emailContent);
};

export const sendEmailVerificationEmail = async (emailAddress: string, verificationToken: string) => {
  const verificationLink = `${APP_URL}/auth/email-verification/${verificationToken}`;
  const emailContent = `Please verify your email by clicking the link below:<br/><br/>
<a href="${verificationLink}">${verificationLink}</a>`;
  await sendEmail(emailAddress, 'Email verification', emailContent);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
  const resetLink = `${APP_URL}/auth/password-reset/${resetToken}`;
  const emailContent = `Please reset your password via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
  await sendEmail(emailAddress, 'Password reset', emailContent);
};

// const transformDatabaseEmail = (databaseEmail: Email) => {
const transformDatabaseEmail = (databaseEmail: any) => ({
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

  // return databaseEmails.map((databaseEmail: Email) => {
  return databaseEmails.map((databaseEmail: any) => transformDatabaseEmail(databaseEmail));
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
