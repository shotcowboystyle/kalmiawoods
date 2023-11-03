import { prismaClient } from '@/lib/db.js';
import type { User, UserProfile, UserProfileWithoutId } from '@/types/User';
import type { User as PrismaUser, UserProfile as PrismaUserProfile } from '@prisma/client';

interface DatabaseUserProfileWithAuthUser extends PrismaUserProfile {
	user: PrismaUser;
}

const transformDatabaseUserProfile = (databaseUserProfile: PrismaUserProfile): UserProfile => ({
	profileId: databaseUserProfile.id,
	address: databaseUserProfile.address ?? undefined,
	firstName: databaseUserProfile.first_name,
	lastName: databaseUserProfile.last_name,
	mobilePhone: databaseUserProfile.mobile_phone,
	avatar: databaseUserProfile.avatar ?? undefined,
});

const transformDatabaseUserProfileWithAuthUser = (
	databaseUserProfileWithAuthUser: DatabaseUserProfileWithAuthUser,
): User => ({
	userId: databaseUserProfileWithAuthUser.user.id,
	email: databaseUserProfileWithAuthUser.user.email,
	emailVerified: databaseUserProfileWithAuthUser.user.email_verified,
	role: databaseUserProfileWithAuthUser.user.role,
	profileId: databaseUserProfileWithAuthUser?.id,
	address: databaseUserProfileWithAuthUser?.address ?? undefined,
	firstName: databaseUserProfileWithAuthUser?.first_name,
	lastName: databaseUserProfileWithAuthUser?.last_name,
	mobilePhone: databaseUserProfileWithAuthUser?.mobile_phone,
	avatar: databaseUserProfileWithAuthUser?.avatar ?? undefined,
});

export const updateUserProfile = async (userId: string, data: UserProfileWithoutId) => {
	try {
		const updatedUserProfile = await prismaClient.userProfile.upsert({
			where: { user_id: userId },
			include: {
				user: true,
			},
			update: {
				...(data.firstName && { first_name: data.firstName }),
				...(data.lastName && { last_name: data.lastName }),
				...(data.address && { address: data.address }),
				...(data.mobilePhone && { mobile_phone: data.mobilePhone?.replace(/\D/g, '') }),
				// ...(data.avatar && { avatar: data.avatar }),
			},
			create: {
				user_id: userId,
				first_name: data.firstName,
				last_name: data.lastName,
				address: data.address ?? undefined,
				mobile_phone: data.mobilePhone?.replace(/\D/g, ''),
				avatar: data.avatar ?? undefined,
			},
		});

		return transformDatabaseUserProfileWithAuthUser(updatedUserProfile);
	} catch (error: Error) {
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
