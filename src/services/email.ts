// import type { Email } from '@prisma/client';

import { BASE_APP_URL } from '@/app/constants';
import { prisma } from '@/lib/db.js';

const sendEmail = async (emailAddress: string, subject: string, content: string) => {
  await prisma.email.create({
    data: {
      subject,
      email_address: emailAddress,
      content,
      date_sent: new Date(),
    },
  });
};

export const sendEmailVerificationEmail = async (emailAddress: string, verificationToken: string) => {
  const resetLink = `${BASE_APP_URL}/auth/email-verification/${verificationToken}`;
  const emailContent = `Please complete your registration for Kalmia Woods via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
  await sendEmail(emailAddress, 'Complete registration for Kalmia Woods', emailContent);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
  const resetLink = `${BASE_APP_URL}/auth/password-reset/${resetToken}`;
  const emailContent = `Please reset your password via the link below:<br/><br/>

<a href="${resetLink}">${resetLink}</a>`;
  await sendEmail(emailAddress, 'Password reset', emailContent);
};

// const transformDatabaseEmail = (databaseEmail: Email) => ({
//   emailId: databaseEmail.id,
const transformDatabaseEmail = (databaseEmail) => ({
  emailId: databaseEmail.id,
  toAddress: databaseEmail.email_address,
  dateSent: databaseEmail.date_sent,
  subject: databaseEmail.subject,
  content: databaseEmail.content,
});

export const getEmails = async (emailAddressQuery?: string) => {
  const databaseEmails = await prisma.email.findMany({
    where: {
      email_address: {
        contains: emailAddressQuery ?? '',
      },
    },
    orderBy: {
      date_sent: 'desc',
    },
  });

  // return databaseEmails.map((databaseEmail: Email) => transformDatabaseEmail(databaseEmail));
  return databaseEmails.map((databaseEmail) => transformDatabaseEmail(databaseEmail));
};

export const getEmail = async (emailId: string) => {
  const databaseEmail = await prisma.email.findFirst({
    where: {
      id: emailId,
    },
  });

  if (!databaseEmail) {
    return null;
  }

  return transformDatabaseEmail(databaseEmail);
};
