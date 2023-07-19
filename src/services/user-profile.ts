import { prisma } from '@/lib/db.js';
import type { User, UserProfile, UserProfileWithoutId } from '@/types/User';
import type { AuthUser, UserProfile as PrismaUserProfile } from '@prisma/client';

interface DatabaseUserProfileWithAuthUser extends PrismaUserProfile {
  auth_user: AuthUser;
}

const transformDatabaseUserProfile = (databaseUserProfile: PrismaUserProfile): UserProfile => ({
  profileId: databaseUserProfile.id,
  address: databaseUserProfile.address ?? undefined,
  firstName: databaseUserProfile.first_name,
  lastName: databaseUserProfile.last_name,
  mobilePhone: databaseUserProfile.mobile_phone,
  avatar: databaseUserProfile.avatar ?? undefined,
});

const transformDatabaseUserProfileWithAuthUser = (databaseUserProfileWithAuthUser: DatabaseUserProfileWithAuthUser): User => ({
  userId: databaseUserProfileWithAuthUser.auth_user.id,
  email: databaseUserProfileWithAuthUser.auth_user.email,
  emailVerified: databaseUserProfileWithAuthUser.auth_user.email_verified,
  role: databaseUserProfileWithAuthUser.auth_user.role,
  profileId: databaseUserProfileWithAuthUser?.id,
  address: databaseUserProfileWithAuthUser?.address ?? undefined,
  firstName: databaseUserProfileWithAuthUser?.first_name,
  lastName: databaseUserProfileWithAuthUser?.last_name,
  mobilePhone: databaseUserProfileWithAuthUser?.mobile_phone,
  avatar: databaseUserProfileWithAuthUser?.avatar ?? undefined,
});

export const updateUserProfile = async (profileId: string, data: UserProfileWithoutId) => {
  try {
    const updatedUserProfile = await prisma.userProfile.update({
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
    if (error.code === 'P2002') {
      throw new Error('Mobile phone number is already registered to another user');
    }

    throw new Error('An unknown error occurred');
  }
};

export const getUserProfile = async (userId: string) => {
  const databaseUserProfile = await prisma.userProfile.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!databaseUserProfile) {
    throw new Error('User not found');
  }

  return transformDatabaseUserProfile(databaseUserProfile);
};
