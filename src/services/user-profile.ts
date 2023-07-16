import prismaClient from '@/lib/db.js';
import type { User, UserProfile, UserProfileWithoutId } from '@/types/User';

const transformDatabaseUserProfile = (databaseUserProfile): UserProfile => ({
  profileId: databaseUserProfile.id,
  address: databaseUserProfile.address,
  firstName: databaseUserProfile.first_name,
  lastName: databaseUserProfile.last_name,
  mobilePhone: databaseUserProfile.mobile_phone,
  avatar: databaseUserProfile.avatar,
});

const transformDatabaseUserProfileWithAuthUser = (databaseUserProfileWithAuthUser): User => ({
  userId: databaseUserProfileWithAuthUser.auth_user.id,
  email: databaseUserProfileWithAuthUser.auth_user.email,
  emailVerified: databaseUserProfileWithAuthUser.auth_user.email_verified,
  role: databaseUserProfileWithAuthUser.auth_user.role,
  profileId: databaseUserProfileWithAuthUser?.id ?? null,
  address: databaseUserProfileWithAuthUser?.address ?? null,
  firstName: databaseUserProfileWithAuthUser?.first_name ?? null,
  lastName: databaseUserProfileWithAuthUser?.last_name ?? null,
  mobilePhone: databaseUserProfileWithAuthUser?.mobile_phone ?? null,
  avatar: databaseUserProfileWithAuthUser?.avatar ?? null,
});

export const updateUserProfile = async (profileId: string, data: UserProfileWithoutId) => {
  try {
    const updatedUserProfile = await prismaClient.userProfile.update({
      where: { id: profileId },
      include: {
        auth_user: true,
      },
      data: {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.address && { address: data.address }),
        ...(data.mobilePhone && { mobile_phone: data.mobilePhone?.replace(/\D/g, '') }),
        // ...(data.avatar && { avatar: data.avatar }),
      },
    });

    return transformDatabaseUserProfileWithAuthUser(updatedUserProfile);
  } catch (error: any) {
    console.log('ERROR', error);
    if (error.code === 'P2002') {
      throw new Error('Mobile phone number is already registered to another user');
    }

    throw new Error('An unknown error occurred');
  }
};

export const getUserProfile = async (userId: string) => {
  const databaseUserProfile = await prismaClient.userProfile.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!databaseUserProfile) {
    throw new Error('User not found');
  }

  return transformDatabaseUserProfile(databaseUserProfile);
};
