import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia-auth';

import { prismaClient } from '@/db.js';
import { auth } from '@/lib/lucia';
import { sendEmailVerificationEmail } from '@/services/email';
import { emailVerificationToken } from '@/services/verification-token';
// import type { User, UserProfile } from '@/types/User';
import type { User, UserProfileWithoutId } from '@/types/User';
import { generatePassword } from '@/utils/generate-password';

const transformDatabaseUserWithProfile = (databaseUserWithProfile: any): User => ({
  id: databaseUserWithProfile.id,
  email: databaseUserWithProfile.email,
  emailVerified: databaseUserWithProfile.email_verified,
  role: databaseUserWithProfile.role,
  address: databaseUserWithProfile.profile?.address ?? null,
  firstName: databaseUserWithProfile.profile?.first_name ?? null,
  lastName: databaseUserWithProfile.profile?.last_name ?? null,
  mobilePhone: databaseUserWithProfile.profile?.mobile_phone ?? null,
  avatar: databaseUserWithProfile.profile?.avatar ?? null,
});

export const createUser = async (data: User) => {
  const password = generatePassword();

  let createdUser;
  try {
    createdUser = await auth.createUser({
      primaryKey: {
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Email is already taken');
    }

    throw new Error('An unknown error occurred');
  }

  const { userId } = createdUser;
  const token = await emailVerificationToken.issue(userId);
  await sendEmailVerificationEmail(data.email, token.toString());

  try {
    createdUser = await prismaClient.authUser.update({
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
    throw new Error('An unknown error occurred');
  }

  return transformDatabaseUserWithProfile(createdUser);
};

export const updateUserEmail = async (userId: string, email: string) => {
  try {
    return await auth.updateUserAttributes(userId, {
      email,
    });
  } catch (error: any) {
    if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
      throw new Error('Email is already taken');
    }

    // duplication error
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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

export const updateUserProfile = async (userId: string, data: UserProfileWithoutId) => {
  const updatedUserProfile = await prismaClient.authUser.update({
    where: { id: userId },
    include: {
      profile: true,
    },
    data: {
      profile: {
        upsert: {
          update: {
            ...(data.firstName && { first_name: data.firstName }),
            ...(data.lastName && { last_name: data.lastName }),
            ...(data.address && { address: data.address }),
            ...(data.mobilePhone && { mobile_phone: data.mobilePhone?.replace(/\D/g, '') }),
            // ...(data.avatar && { avatar: data.avatar }),
          },
          create: {
            first_name: data.firstName,
            last_name: data.lastName,
            address: data.address,
            mobile_phone: data.mobilePhone?.replace(/\D/g, ''),
            // avatar: data.avatar,
          },
        },
      },
    },
  });

  return transformDatabaseUserWithProfile(updatedUserProfile);
};

export const getUsers = async () => {
  const databaseUsers = await prismaClient.authUser.findMany({
    include: {
      profile: true,
    },
  });

  return databaseUsers.map((databaseUser: any) => transformDatabaseUserWithProfile(databaseUser));
};

export const getUser = async (userId: string) => {
  const databaseUser = await prismaClient.authUser.findFirst({
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

  return transformDatabaseUserWithProfile(databaseUser);
};

export const deleteUser = async (userId: string) => {
  const deleteUserProfile = prismaClient.userProfile.delete({
    where: {
      user_id: userId,
    },
  });

  const deleteUserReservations = prismaClient.reservation.deleteMany({
    where: {
      user_id: userId,
    },
  });

  await prismaClient.$transaction([deleteUserProfile, deleteUserReservations]);

  return auth.deleteUser(userId);
};
