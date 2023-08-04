import { LuciaError } from 'lucia';

import { prisma } from '@/lib/db.js';
import { auth } from '@/lib/lucia';
import { sendEmailVerificationEmail } from '@/services/email';
import { generateEmailVerificationToken } from '@/services/verification-token';
import { isValidEmail } from '@/utils/email';
import { generatePassword } from '@/utils/generate-password';

import type { User } from '@/types/User';
import type { User as PrismaUser, UserProfile } from '@prisma/client';

interface DatabaseUserWithProfile extends PrismaUser {
  profile: UserProfile;
}

const transformDatabaseUserWithProfile = (databaseUserWithProfile: DatabaseUserWithProfile): User => ({
  userId: databaseUserWithProfile.id,
  email: databaseUserWithProfile.email,
  emailVerified: databaseUserWithProfile.email_verified,
  role: databaseUserWithProfile.role,
  profileId: databaseUserWithProfile.profile?.id,
  address: databaseUserWithProfile.profile?.address ?? undefined,
  firstName: databaseUserWithProfile.profile?.first_name,
  lastName: databaseUserWithProfile.profile?.last_name,
  mobilePhone: databaseUserWithProfile.profile?.mobile_phone,
  avatar: databaseUserWithProfile.profile?.avatar ?? undefined,
});

export const createUser = async (data: User) => {
  const password = generatePassword();

  let createdUser;
  try {
    createdUser = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: data.email,
        password,
      },
      attributes: {
        email: data.email,
        email_verified: false,
        role: 'USER',
      },
    });
  } catch (error: any) {
    if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
      throw new Error('Email is already taken');
    }

    // duplication error
    // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    if (error.code === 'P2002') {
      throw new Error('Email is already taken');
    }

    throw new Error('An unknown error occurred');
  }

  const { userId } = createdUser;
  const token = await generateEmailVerificationToken(userId);
  await sendEmailVerificationEmail(data.email, token.toString());

  try {
    createdUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          create: {
            first_name: data.firstName,
            last_name: data.lastName,
            address: data.address,
            mobile_phone: data.mobilePhone?.replace(/\D/g, ''),
            avatar: data.avatar,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Mobile phone number is already registered to another user');
    }

    throw new Error('An unknown error occurred');
  }

  return transformDatabaseUserWithProfile(createdUser as DatabaseUserWithProfile);
};

export const updateUserEmail = async (userId: string, currentEmail: string, newEmail: string) => {
  if (!isValidEmail(newEmail)) {
    throw new Error('Invalid email address');
  }

  try {
    await prisma.key.update({
      where: {
        id: 'email:' + currentEmail,
      },
      data: {
        id: 'email:' + newEmail,
      },
    });
    return await auth.updateUserAttributes(userId, {
      email: newEmail,
    });
  } catch (error: any) {
    if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
      throw new Error('Email is already taken');
    }

    // duplication error
    // if (error instanceof Prisma.PrismaKnownRequestError && error.code === 'P2002') {
    if (error.code === 'P2002') {
      throw new Error('Email is already taken');
    }

    throw new Error('An unknown error occurred');
  }
};

export const updateUserPassword = async (email: string, password: string) => {
  if ((password as any) instanceof File || password === null || password.length < 8) {
    throw new Error('Invalid password');
  }

  try {
    return await auth.updateKeyPassword('email', email, password);
  } catch (error: any) {
    throw new Error('An unknown error occurred');
  }
};

export const getUsers = async () => {
  const databaseUsers = await prisma.user.findMany({
    include: {
      profile: true,
    },
  });

  return databaseUsers.map((databaseUser: any) => transformDatabaseUserWithProfile(databaseUser));
};

export const getUser = async (userId: string) => {
  const databaseUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!databaseUser) {
    throw new Error('User not found');
  }

  return transformDatabaseUserWithProfile(databaseUser as DatabaseUserWithProfile);
};

export const deleteUser = async (userId: string) => {
  // const deleteUserReservations = prisma.reservation.deleteMany({
  await prisma.reservation.deleteMany({
    where: {
      user_id: userId,
    },
  });

  // const deleteTransactions = [deleteUserReservations];

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (userProfile) {
    // deleteTransactions.push(
    await prisma.userProfile.delete({
      where: {
        user_id: userId,
      },
    });
    // );
  }

  // await prisma.$transaction(deleteTransactions);

  return await auth.deleteUser(userId);
};
