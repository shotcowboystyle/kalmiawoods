import { sendCompleteRegistrationEmail } from '@/auth/email';
import { auth, completeRegistrationToken } from '@/auth/lucia';
import { prismaClient } from '@/db.js';
import type { User } from '@/types/user';
import { generateId } from '@/utils/generate-id';

const transformDatabaseUserWithProfile = (databaseUserWithProfile: any): User => {
  return {
    id: databaseUserWithProfile.id,
    email: databaseUserWithProfile.email,
    emailVerified: databaseUserWithProfile.email_verified,
    role: databaseUserWithProfile.role,
    status: databaseUserWithProfile.status,
    address: databaseUserWithProfile.profile.address,
    firstName: databaseUserWithProfile.profile.first_name,
    lastName: databaseUserWithProfile.profile.last_name,
    mobilePhone: databaseUserWithProfile.profile.mobile_phone,
    avatar: databaseUserWithProfile.profile.avatar,
  };
};

export const createUser = async ({
  email,
  password,
  role = 'USER',
  status = 'CREATED',
  firstName,
  lastName,
  address,
  mobilePhone,
  avatar,
}: User) => {
  const authUser = await auth.createUser({
    primaryKey: {
      providerId: 'email',
      providerUserId: email,
      password,
    },
    attributes: {
      email,
      email_verified: false,
      role,
      status,
    },
  });

  const token = await completeRegistrationToken.issue(authUser.userId);
  await sendCompleteRegistrationEmail(email, token.toString());
  // return Astro.redirect('/auth/email-verification', 302);

  const createdUser = await prismaClient.userProfile.create({
    data: {
      id: generateId(8),
      user_id: authUser.userId,
      first_name: firstName,
      last_name: lastName,
      address: address,
      mobile_phone: mobilePhone,
      avatar: avatar,
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
        update: {
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address,
          mobile_phone: data.mobilePhone,
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

  // const deleteUserAuthSessions = prismaClient.authSession.deleteMany({
  //   where: {
  //     user_id: userId,
  //   },
  // });

  // const deleteUserAuthKeys = prismaClient.authKey.deleteMany({
  //   where: {
  //     user_id: userId,
  //   },
  // });

  // const deleteUser = prismaClient.authUser.delete({
  //   where: {
  //     id: userId,
  //   },
  // });

  await prismaClient.$transaction([
    deleteUserProfile,
    deleteUserReservations,
    // deleteUserAuthSessions,
    // deleteUserAuthKeys,
    // deleteUser,
  ]);

  return await auth.deleteUser(userId);
};
