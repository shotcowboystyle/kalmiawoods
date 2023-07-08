import { sendCompleteRegistrationEmail } from '@/auth/email';
import { auth, completeRegistrationToken } from '@/auth/lucia';
import { prismaClient } from '@/db.js';
import type { User } from '@/types/user';
import { generateId } from '@/utils/generate-id';
import { generatePassword } from '@/utils/generate-password';

const transformDatabaseUserWithProfile = (databaseUserWithProfile: any): User => ({
  id: databaseUserWithProfile.id,
  email: databaseUserWithProfile.email,
  emailVerified: databaseUserWithProfile.email_verified,
  role: databaseUserWithProfile.role,
  status: databaseUserWithProfile.status,
  address: databaseUserWithProfile.profile?.address ?? null,
  firstName: databaseUserWithProfile.profile?.first_name ?? null,
  lastName: databaseUserWithProfile.profile?.last_name ?? null,
  mobilePhone: databaseUserWithProfile.profile?.mobile_phone ?? null,
  avatar: databaseUserWithProfile.profile?.avatar ?? null,
});

export const createUser = async (data: User) => {
  const password = generatePassword();
  const authUser = await auth.createUser({
    primaryKey: {
      providerId: 'email',
      providerUserId: data.email,
      password,
    },
    attributes: {
      email: data.email,
      email_verified: false,
      role: 'USER',
      status: 'CREATED',
    },
  });

  const token = await completeRegistrationToken.issue(authUser.userId);
  await sendCompleteRegistrationEmail(data.email, token.toString());

  const createdUser = await prismaClient.authUser.update({
    where: {
      id: authUser.userId,
    },
    data: {
      profile: {
        update: {
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address ?? null,
          mobile_phone: data.mobilePhone?.replace(/\D/g,'') ?? null,
          avatar: data.avatar ?? null,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return transformDatabaseUserWithProfile(createdUser);
};

export const updateUser = async (data: Partial<User>) => {
  const updatedUser = await prismaClient.authUser.update({
    where: { id: data.id },
    data: {
      email: data.email,
      email_verified: data.emailVerified,
      status: data.status,
      profile: {
        upsert: {
          id: generateId(8),
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address,
          mobile_phone: data.mobilePhone?.replace(/\D/g,''),
          avatar: data.avatar,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return transformDatabaseUserWithProfile(updatedUser);
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
